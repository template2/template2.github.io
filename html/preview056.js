(function($) {

	var $is_mobile = false;//모바일 기기 체크
	checkMobile()

	var bSidebarCategory = $('body.category-side').length ? true:false;//카테고리 방향 결정

	setMobileCategory(); //모바일 메뉴로 카테고리 붙였다 뗌
	setNoImage();//이미지 없는 썸네일 배경 이미지 처리
	checkSearchBar();

	function coverSlider(){
		$(".cover-slider").each(function(){
			
			var $this = $(this), //현재 슬라이드 이너 객체
				$sliderItems = $(this).find("li"), //슬라이드 아이템들 객체 리스트
				$itemsLength = $sliderItems.length, //슬라이드 아이템 갯수
				$num = 0, //슬라이드 인덱스
				$looper = null; //슬라이드 인터벌 타이머 객체
				$interval = 5000;// 슬라이드 이동 간격, 0이면 멈춤
				$animateTime = 500; //슬라이드 이동시간
				$timeouts = [];
			
			if ( $itemsLength > 1 ){
				//add prev, next button
				$this.append('<button type="button" class="prev"><span>이전</span></button><button type="button" class="next"><span>다음</span></button>');
				$looper = setLoop();
					
				//add indicator
				$this.append('<ol class="cover-slider-indicator"></ol>');
				for(let i=0;i<$itemsLength;i++){
					var $element = $('<li index="'+i+'" class="'+(i==0?'active':'')+'"></li>');
					$element.click(function(){
						
						var $clicked_indicator = parseInt($(this).attr('index'));
						if($num != $clicked_indicator){
							var sliding_size = Math.abs($num - $clicked_indicator);
							clearInterval($looper);
							
							for(let j = 0;j<sliding_size;j++){
								(function(direction, index){
									$timeouts.push(setTimeout(function(){
										moveCascadeSlides(direction, index);
										},$animateTime*index));
									}
								)(($num < $clicked_indicator ? 1:-1), j);
							}
							$looper = setLoop();
						}
					});
					$this.find('.cover-slider-indicator').append($element);
				}
				//add css property to slider
				$sliderItems.css({
					"position": "absolute",
					"top": 0,
				});
				$sliderItems.eq($num).siblings().css("left","100%");
	
				//add prev click event
				$this.on("click", ".prev", function(){
					if ( !$sliderItems.eq($num).is(":animated") ){
						$sliderItems.eq($num).animate({ left: "100%" }, $animateTime ).siblings().css("left","-100%");
						$num = $num-1 < 0 ? $sliderItems.length-1 : $num-1;
						moveSlide();
						$($this).find('ol li').removeClass('active');
						$($this).find('ol li').eq($num).addClass('active');
					}
				});
				
				//add next click event
				$this.on("click", ".next", function(){
					if ( !$sliderItems.eq($num).is(":animated") ){
						$sliderItems.eq($num).animate({ left: "-100%" }, $animateTime ).siblings().css("left","100%");
						$num = $num+1 >= $sliderItems.length ? 0 : $num+1;
						moveSlide();
						$($this).find('ol li').removeClass('active');
						$($this).find('ol li').eq($num).addClass('active');
					}
				});
				
				//slide rotate init
				function setLoop(){
					if($interval > 0){
						return setInterval(
							function autoScrollSlider(){
								$($this).find('.next').trigger( "click" );
							}, $interval
						);
					}
				}
	
				//animate indicator click
				function moveCascadeSlides(direction, idx){
					var next_num = $num + direction;
					$sliderItems.eq($num).animate({ left: (-100*direction)+"%" }, $animateTime ).siblings().css("left",(100*direction)+"%");
					$sliderItems.eq(next_num).animate({ left: "0" }, $animateTime );
					$($this).find('ol li').removeClass('active');
					$($this).find('ol li').eq(next_num).addClass('active');
					$num = next_num;
					clearTimeout($timeouts[idx]);
				}
				
				//animate 1 slide item
				function moveSlide(){
					$sliderItems.eq($num).animate({ left: "0" }, $animateTime );
					$(".cover-slider .paging button").eq($num).addClass("current").siblings().removeClass("current");
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
			}//itemsLength > 1
		});
	}	

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
	function setNoImage(){
		$(".cover-thumbnail-list .thum, .cover-gallery figure").each(function(){
			if(!$(this).find('img').length){
				$(this).append('<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAQAAAAe/WZNAAAADklEQVR42mNkgAJGDAYAAFEABCaLYqoAAAAASUVORK5CYII=">');
				$(this).addClass('noimage');
			}
		});
		$(".post-item, .recent-posts > li").each(function(){
			if(!$(this).find('.thum img').length){
				$(this).find('.thum').append('<img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7">');
				$(this).addClass('noimage');
			}
		})	
	}

	//모바일기기체크 - @media로 체크
	function checkMobile(){
		if( $('.mobile-menu').css('position')=='fixed') {
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
	function checkSearchBar(){
		if($is_mobile && $('.search.on').length){
			//모바일이면 검색 펼침 닫기
			$('.search.on').removeClass('on');
			$('.search .attach').removeClass('attach');
		}		
	}

	function gnb(){
		//모바일 메뉴 아이콘 클릭 처리
		$(".mobile-menu").on("click", function(){
			var ac = $('#sidebar').detach();
			if ( $(this).hasClass("on") ){
				//모바일 사이드 메뉴 온시 컨텐츠 스크롤 락
				//$('body').css('overflow','visible');
				$('#dimmed').off('scroll touchmove touchend mousewheel');

				if(ac.length){
					ac.prependTo('#wrap .container');
				}
				$(this).removeClass("on");
				$("#header .menu").removeClass("on");
				$("#dimmed").remove();
				$('.box_header_wrap').detach().appendTo('#header');
			} else {
				$('.search').removeClass("on");
				$(this).addClass("on");
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
			//커버슬라이더 헤더에 붙은 경우에만
			if($('body.cover-slider-header').length){
				if(!$is_mobile && $('body.category-side').length){
					$('#header').css('height','400px');
				}else{
					$('#header').css('height','444px');
				}
			}		
			checkMobile();
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
				if($('.nav').length){
					$('.nav').removeClass('on');
				}
			}
		});
		//검색버튼
		$(document).on("click", "#wrap .search", function(){
			if ( !$(this).hasClass("on") ){
				$(this).addClass("on").find("input").focus();
				$('.mobile-menu.on').click();
				return false;
			}
		});
		$(document).on("click", ".close-search", function(){
				$("#wrap .search").removeClass("on").find("input").focus();
				return false;
		});

	}//gnb

	gnb();

	if($('.btn-top').length){
		$('.btn-top').click(function(){
			$("html, body").animate({ scrollTop: 0 }, 600);
			return false;
		});
	}

	if ( $(".cover-slider").length ){
		coverSlider();
		if($('body.cover-slider-header').length){
			$('.cover-slider').detach().appendTo('#header');
			if(!$is_mobile && $('body.category-side').length){
				$('#header').css('height','400px');
			}else{
				$('#header').css('height','444px');
			}
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
	if ( $(".entry-content").length ){
		mobileTable();
		iframeWrap();
	}
})(jQuery);
