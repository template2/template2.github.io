(function($) {

	// 083 Responsive ReverseBox

	var $is_mobile = false;//모바일 기기 체크
	checkMobile()

	var bSidebarCategory = $('body.category-side').length ? true:false;//카테고리 방향 결정

	setMobileCategory(); //모바일 메뉴로 카테고리 붙였다 뗌
	setNoImage();//이미지 없는 썸네일 배경 이미지 처리
	unfoldSearchBar();
	setSearchBarPosition(); //검색바 위치 이동

	function coverSlider(){
		$(".cover-slider").each(function(){
			
			var $this = $(this); // 현재 슬라이드 이너 객체

			//환경설정
			// 슬라이드 애니메이션 타입
			$animtype = $('body').data('cover-slider-type') != undefined ? $('body').data('cover-slider-type'):0; // 0:오른쪽방향 이동(next클릭), 1: 왼쪽방향 이동(prev클릭), 2: 페이드인아웃 오른쪽 방향(next클릭), 3: 페이드인아웃 왼쪽 방향(prev클릭)
			//슬라이드 교체 간격
			$secondval = $('body').data('cover-slider-interval') != undefined ? (!isNaN($('body').data('cover-slider-interval'))?parseInt($('body').data('cover-slider-interval')):5):5; // 커버 슬라이드 교체 간격. 기본값 5(초)
			$interval = $secondval*1000; // 슬라이드 이동 간격 - 기본설정 5000(5초), 0이면 멈춤, 슬라이드 교체 간격
			$animateTime = 500; // 슬라이드 이동시간 - 기본설정 500(0.5초), 커지면 느리게 애니메이션

			//애니메이션 내부처리용 변수
			$sliderItems = $(this).find("li"), // 슬라이드 아이템들 객체 리스트
			$itemsLength = $sliderItems.length, // 슬라이드 아이템 갯수
			$num = 0, // 슬라이드 인덱스
			$looper = null; // 슬라이드 인터벌 타이머 객체
			$timeouts = [];
			//애니메이션 타입별 트랜지션 기본값 설정
			$animstart = {left: "100%"};
			$animtrans = {left: "0"};
			$animend = {left: "-100%"};
			$animdirectcss = ".next";
			$slideview = 'table'; //페이드 처리용 인액티브 슬라이드 순서
			$transslideview = 'table'; //페이드 처리용 액티브 슬라이드 순서

			// 디폴트 0 제외하고 나머지 애니메이션 타입만 설정
			switch($animtype){
				case 1:
					$animdirectcss = ".prev";
					break;
				case 2:
					$animstart = {opacity: 0};
					$animtrans = {opacity: 1};
					$animend = {opacity: 0};
					$slideview = 'none';
					break;
				case 3:
					$animstart = {opacity: 0};
					$animtrans = {opacity: 1};
					$animend = {opacity: 0};
					$slideview = 'none';
					$animdirectcss = ".prev";
					break;
			}
			
			//커버 슬라이드 있으면
			if ( $itemsLength > 1 ){
				//add prev, next button
				$this.append('<button type="button" class="prev"><span>이전</span></button><button type="button" class="next"><span>다음</span></button>');
					
				//add indicator
				$this.append('<ol class="cover-slider-indicator"></ol>');

				$looper = setLoop();//자동 루프

				for(let i=0;i<$itemsLength;i++){
					var $element = $('<li index="'+i+'" class="'+(i==0?'active':'')+'"></li>');
					$element.click(function(){
						
						var $clicked_indicator = parseInt($(this).attr('index'));
						if($num != $clicked_indicator){
							var sliding_size = Math.abs($num - $clicked_indicator);
							clearInterval($looper);//임시로 루프 죽이고
							
							//슬라이드 순차 이동
							for(let j = 0;j<sliding_size;j++){
								(function(direction, index){
									$timeouts.push(setTimeout(function(){
										moveCascadeSlides(direction, index);
										},$animateTime*index));
									}
								)(($num < $clicked_indicator ? 1:-1), j);
							}
							$looper = setLoop();//루프 재설정
						}
					});
					$this.find('.cover-slider-indicator').append($element);
				}
				//add css property to slider
				$sliderItems.css({
					"position": "absolute",
					"top": 0,
				});
				$sliderItems.eq($num).css(Object.keys($animtrans)[0], $animtrans[Object.keys($animtrans)[0]]).css('display', $transslideview);
				$sliderItems.eq($num).siblings().css(Object.keys($animstart)[0], $animstart[Object.keys($animstart)[0]]).css('display', $slideview);
	
				//add prev click event
				$this.on("click", ".prev", function(){
					if ( !$sliderItems.eq($num).is(":animated") ){
						clearInterval($looper);//임시로 루프 죽이고
						var $pnum=$num;
						$sliderItems.eq($num).animate($animstart, $animateTime, function(){slideDisplay($pnum, $slideview);});
						$sliderItems.eq($num).siblings().css(Object.keys($animend)[0], $animend[Object.keys($animend)[0]]);
						$num = $num-1 < 0 ? $sliderItems.length-1 : $num-1;
						moveSlide($num);
						$($this).find('ol li').removeClass('active');
						$($this).find('ol li').eq($num).addClass('active');
						$looper = setLoop();//루프 재설정
					}
				});
				
				//add next click event
				$this.on("click", ".next", function(){
					if ( !$sliderItems.eq($num).is(":animated") ){
						clearInterval($looper);//임시로 루프 죽이고
						var $pnum=$num;
						$sliderItems.eq($num).animate($animend, $animateTime, function(){slideDisplay($pnum, $slideview);});
						$sliderItems.eq($num).siblings().css(Object.keys($animstart)[0], $animstart[Object.keys($animstart)[0]]);
						$num = $num+1 >= $sliderItems.length ? 0 : $num+1;
						moveSlide($num);
						$($this).find('ol li').removeClass('active');
						$($this).find('ol li').eq($num).addClass('active');
						$looper = setLoop();//루프 재설정
					}
				});
				
				//slide rotate init
				function setLoop(){
					if($interval > 0){
						return setInterval(
							function autoScrollSlider(){
								$($this).find($animdirectcss).trigger( "click" );
							}, $interval
						);
					}
				}
	
				//animate indicator click
				function moveCascadeSlides(direction, idx){
					var $next_num = $num + direction;
					var $pnum = $num;
					$sliderItems.eq($num).animate(direction==1?$animend:$animstart, $animateTime, function(){slideDisplay($pnum, $slideview);});
					$sliderItems.eq($num).siblings().css(Object.keys($animstart)[0], direction==1?$animstart[Object.keys($animstart)[0]]:$animend[Object.keys($animend)[0]]);
					$sliderItems.eq($next_num).css('display', $transslideview).animate($animtrans, $animateTime);
					$($this).find('ol li').removeClass('active');
					$($this).find('ol li').eq($next_num).addClass('active');
					$num = $next_num;
					clearTimeout($timeouts[idx]);
				}
				
				//animate 1 slide item
				function moveSlide(newnum){
					$sliderItems.eq(newnum).css('display', $transslideview).animate($animtrans, $animateTime);
					$(".cover-slider .paging button").eq(newnum).addClass("current").siblings().removeClass("current");
				}

				//z-index change callback function
				function slideDisplay(idx, state_display){
					$sliderItems.eq(idx).css('display',state_display);
				}
	
				//add mobile touch
				$this.on("touchstart", function(){
					var touch = event.touches[0];
					touchstartX = touch.clientX,
					touchstartY = touch.clientY;
				});
	
				//add mobile touch end
				$this.on("touchend", function(){
					if( event.touches.length == 0 ){
						var touch = event.changedTouches[event.changedTouches.length - 1];
						touchendX = touch.clientX,
						touchendY = touch.clientY,
						touchoffsetX = touchendX - touchstartX,
						touchoffsetY = touchendY - touchstartY;
	
						if ( Math.abs(touchoffsetX) > 10 && Math.abs(touchoffsetY) <= 100 ){
							if (touchoffsetX < 0 ){
								$this.find(".next").click();
							} else {
								$this.find(".prev").click();
							}
						}
					}
				});
				
				//set slider item index text
				//각 슬라이더 텍스트에 1/3, 2/3, 3/3 과 같이 인덱스를 붙이고 싶은 경우 .index 클래스로 커버 슬라이더 <li> 태그 안에 <span class="index"></span> 식으로 태그를 넣어주면 자동으로 인덱스가 붙음
				/*
				$this.find('.index').each(function(idx){
					$(this).html((idx+1)+'/'+$itemsLength)
				})
				*/
				
				//set cover slider height
				//커버 슬라이더(.cover-slider)에 높이 값이 정의되지 않거나 내부 슬라이더 이미지 크기에 맞춰 자동으로 높이를 맞출 필요가 있을 경우 아래 행이 그 기능을 함.
				//csds에 .cover-slider 높이값이 강제 적용하는 경우 아래행을 리마크 해야함
				//$(".cover-slider").find("ul").height( $sliderItems.eq($num).height() );
				
			}//itemsLength > 1
		});
	}//coverSlider() End

	function coverMasonry(){
		var $masonry = $(".cover-masonry");

		$.getScript( "//unpkg.com/masonry-layout@4/dist/masonry.pkgd.min.js", function( data, textStatus, jqxhr ) {
			$masonry.each(function(){
				var $this = $(this);

				$this.find("ul").css({
					"display": "block",
				}).masonry({
					itemSelector: '.cover-masonry ul li',
					columnWidth: '.cover-masonry ul li',
				});
			});
		});
	}
	function getCookie(name){
		name = new RegExp(name + '=([^;]*)');
		return name.test(document.cookie) ? unescape(RegExp.$1) : '';
	}
	function viewMore(){
		if ( $(".paging-view-more").length && $(".post-item").length ){
			if ( $(".paging-view-more").length && $(".post-item").length ){
				viewMoreShow();
			}

			function viewMoreShow(){
				var nextUrl = $(".pagination .next").attr("href");
				$(".pagination a").hide();
				if( nextUrl ){
					$(".pagination .inner").append('<a href="'+nextUrl+'" class="btn view-more">더보기 <i class="fas fa-th"></i></a>');
					$(".pagination .view-more").on("click", function(){
						viewMore(nextUrl);
						return false;
					});
				}
			}

			function viewMore(url){
				$.ajax({
					url: url
				}).done(function (res) {
					var $res = $(res),
							$nextPostItem = $res.find(".post-item"),
							$paginationInner = $res.find(".pagination").html();
					if ( $nextPostItem.length > 0 ){
						$("#content .inner").append($nextPostItem);
						$(".pagination").html($paginationInner);
						setNoImage();						
						viewMoreShow();
					} else {
						$(".pagination").remove();
					}
				});
			}
		} else {
			var current_num = $(".pagination .selected").text(),
				total_num = $(".pagination .next").length ? $(".pagination .next").prev().text() : $(".pagination a:last").text();

			$(".pagination .inner").append('<span class="current">'+current_num+'/'+total_num+'</span>');
			$(".pagination .inner .current").css('color',$(".title h1 a").css('color'));
		}
	}

	function mobileTable(){
		var $table = $(".entry-content table");

		if( $table.length > 0 ){
			$table.each(function(){
				if ( $(this).css("table-layout") == "fixed" && !$(this).parent().hasClass("table-wrap") ){
					$(this).wrap('<div class="table-wrap"></div>');
				}
			});
		}
	}

	function iframeWrap(){
		var $iframe = $(".entry-content iframe");

		if( $iframe.length > 0 ){
			$iframe.each(function(){
				if ( !$(this).parent().hasClass("iframe-wrap") ){
					$(this).wrap('<div class="iframe-wrap"></div>');
				}
			});
		}
	}
	//이미지 없는 썸네일 자리 채우기용 투명 이미지 태그 붙이기
	function setNoImage(){
		$(".cover-thumbnail-list .thum, .cover-gallery figure").each(function(){
			if(!$(this).find('img').length){
				$(this).append('<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAACCAQAAAA3fa6RAAAADklEQVR42mNkAANGCAUAACMAA2w/AMgAAAAASUVORK5CYII=">');
				$(this).addClass('noimage');
			}
		});
		$(".post-item, .recent-posts > li").each(function(){
			if(!$(this).find('.thum img').length){
				if($('body.place-thumbnail').length){
					$(this).find('.thum').append('<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAACCAQAAAA3fa6RAAAADklEQVR42mNkAANGCAUAACMAA2w/AMgAAAAASUVORK5CYII=">');
					$(this).addClass('noimage');
				}else{
					$(this).find('.thum').removeClass('thum');
				}
			}
		})	
	}

	//모바일기기체크 - @media로 체크
	function checkMobile(){
		if( $(window).width() <= 1006) {
			$is_mobile = true;
		}else{
			$is_mobile = false;
		}
	}

	//모바일 사이드바로 카테고리 이동
	function setMobileCategory(){
		if($('#header .category-menu').css('display') == 'none' || bSidebarCategory || $is_mobile){
			if($('.category-menu > .inner > .category').length){
				$('#wrap_etc').prepend($('<div id="mobile_category" class="box_aside"><div class="tit_aside">Category</div></div>'));
				$('.category-menu > .inner > .category').detach().appendTo('#mobile_category');
			}
			$('#header .category').css('display','block');
		}else{
			if($('#wrap_etc > #mobile_category').length){
				$('#mobile_category .category').detach().prependTo('.category-menu > .inner');
				$('#mobile_category').remove();
			}
		}
	}
	
	//모바일 메뉴 펼쳐졌으면 클릭 트리거
	function clickMobileMenu(){
		if($('.sidebar').css('display') == 'block'){
			$('.mobile-menu').trigger('click');
		}
	}

	//검색폼 펼쳐졌으면 감춤 처리
	function unfoldSearchBar(){
		if($is_mobile && $('.search.on').length){
			//모바일이면 검색 펼침 닫기
			$('.search.on').removeClass('on');
			$('.search .attach').removeClass('attach');
		}		
	}

	function setSearchBarPosition(){
		//사이드바 좌우 표시할 경우 검색 박스 위치 조정
		if($("body.sidebar-left, body.sidebar-right").length && !$is_mobile){
			if(!$('#sidebar-search').length){
				if($('#profile').length){
					$('#profile').after($('<div id="sidebar-search" class="box_aside"></div>'));
				}else{
					$('#sidebar > inner').prepend($('<div id="sidebar-search" class="box_aside"></div>'));
				}
				$('#header .search').detach().appendTo('#sidebar-search');
			}
		}else{
			if($('#sidebar-search').length){
				$('#sidebar-search .search').detach().appendTo('#header > .nav');
				$('#sidebar-search').remove();
			}
		}		
	}

	//초기화 함수
	function gnb(){
		//모바일 메뉴 아이콘 클릭 처리
		$(".mobile-menu").on("click", function(){
			var ac = $('#sidebar').detach();
			if ( $(this).hasClass("on") ){
				//모바일 사이드 메뉴 온시 컨텐츠 스크롤 락
				//$('body').css('overflow','visible');
				$('#dimmed').off('scroll touchmove touchend mousewheel');

				$('.search').show();
				if(ac.length){
					ac.prependTo('#wrap .container');
				}
				$(this).removeClass("on");
				if(!$('.btn-top').hasClass('hideanim')){
					$('.nav').addClass("on");
				}				
				$("#header .menu").removeClass("on");
				$("#dimmed").remove();
				$('.box_header_wrap').detach().appendTo('#header');
			} else {
				$('.search').hide();
				$(this).addClass("on");
				$('.nav').removeClass("on");				
				$("#header .menu").addClass("on");
				if(ac.length){
					ac.appendTo('nav#gnb');
				}
				$("body").append('<div id="dimmed" />').on("click", "#dimmed", function(){
					$(".mobile-menu").click();
				});
				$('.box_header_wrap').detach().prependTo('#gnb');

				//모바일 사이드 메뉴 온시 컨텐츠 스크롤 락 해제
				//$('body').css('overflow','hidden');
				$('#dimmed').on('scroll touchmove touchend mousewheel', function(e){
					e.preventDefault();
					e.stopPropagation();
					return false;
				});				
			}
		});
		//리사이즈 처리
		$(window).resize(function(){
			checkMobile();
			//커버슬라이더 헤더에 붙은 경우에만
			if($('body.cover-slider-header').length && $('.cover-slider').length){
				if($is_mobile){
					if($('body.mobile-small-cover-slider').length){
						$('#header').css('height','290px');
					}else{
						$('#header').css('height','400px');
					}
				}else{
					if($('body.category-side').length){
						$('#header').css('height','400px');
					}else{
						$('#header').css('height','444px');
					}
				}
			}		
			setSearchBarPosition();
			setMobileCategory();
		});
		//스크롤시 모바일 사이드바 펼침 닫기 처리
		$(window).scroll(function(){
			var height = $(window).scrollTop();
			if ( $('.btn-top').length ){
				if(height > 0){
					$('.btn-top').removeClass('hideanim');
				}else{
					$('.btn-top').addClass('hideanim');
				}
			}
			if($is_mobile){
				if($(window).scrollTop() > 100){
					$('.nav').addClass('on');
				}else{
					$('.nav').removeClass('on');
				}
			}else{
				if($('.nav.on').length){
					$('.nav').removeClass('on');
				}
			}
		});
		//1단 검색버튼
		$(document).on("click", "#wrap .search", function(){
			if ( !$(this).hasClass("on") ){
				$(this).addClass("on").find("input").focus();
				$('.mobile-menu.on').click();
				return false;
			}
		});
		//검색박스 닫기 버튼 클릭 처리
		$(document).on("click", ".close-search", function(){
				$("#wrap .search").removeClass("on").find("input").focus();
				return false;
		});
		//사이드바 좌우 표시할 경우 검색 박스 위치 조정
		if($("body.sidebar-left, body.sidebar-right").length && $(".nav .search").length && !$is_mobile){
			if($('#profile').length){
				$('#profile').after($('<div id="sidebar-search" class="box_aside"></div>'));
			}else{
				$('#sidebar > inner').prepend($('<div id="sidebar-search" class="box_aside"></div>'));
			}
			$('#wrap .search').detach().appendTo('#sidebar-search');
		}

	}//gnb

	gnb();

	//탑으로 애니메이션 스크롤 하는 버튼
	if($('.btn-top').length){
		$('.btn-top').click(function(){
			$("html, body").animate({ scrollTop: 0 }, 600);
			return false;
		});
	}

	//커버 슬라이더 높이 설정
	if ( $(".cover-slider").length ){
		coverSlider();
		if($('body.cover-slider-header').length && $('.cover-slider').length){
			$('.cover-slider').detach().appendTo('#header');
			if($is_mobile){
				if($('body.mobile-small-cover-slider').length){
					$('#header').css('height','290px');
				}else{
					$('#header').css('height','400px');
				}
			}else{
				if($('body.category-side').length){
					$('#header').css('height','400px');
				}else{
					$('#header').css('height','444px');
				}
			}
		}
	}else{
		//커버 슬라이더 없으면 설정클래스 소거
		if($('body.cover-slider-header').length){
			$('body').removeClass('cover-slider-header');
		}
	}

	if ( $(".cover-masonry").length ) coverMasonry();
	if ( $(".paging-view-more").length ) viewMore();
	if( $(".cover-thumbnail-list, .cover-gallery").length ){
		$(".cover-thumbnail-list, .cover-gallery").each(function(){
				var len = $(this).find('ul li').length;
				$(this).addClass('type'+(len>4?parseInt(len/2):len));
		});
	}

	// 링크없는 더보기 감춤
	$('a.text-box').each(function(){
		if($(this).attr('href') == "" || $(this).attr('href').toLowerCase() == "http://" || $(this).attr('href').toLowerCase() == "https://"){
			$(this).remove();
		}
	});

	//강제 크기 정해진 테이블이나 아이프레임 모바일 대응되도록 처리
	if ( $(".entry-content").length ){
		mobileTable();
		iframeWrap();
	}
})(jQuery);
