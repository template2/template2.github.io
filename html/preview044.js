(function($) {

	
	var $is_mobile = false;//모바일 기기 체크
	checkMobile()

	if(!$is_mobile){
		$('#content').css('width',parseInt($('.container').css('width'))-340);//본문 영역 디폴트 크기 설정
	}

	setDateFormat();//YYYY.MM.DD 포맷으로 날짜 형식 변경
	setMobileCategory(); //모바일 메뉴로 카테고리 붙였다 뗌
	setNoImage();

	function gnb(){
		$("#header").on("click", ".mobile-menu", function(){
			var ac = $('#sidebar').detach();
			if ( $(this).hasClass("on") ){
				if(ac.length){
					ac.prependTo('#wrap .container');
				}
				$(this).removeClass("on");
				$("#header .menu").removeClass("on");
				$("#dimmed").remove();
			} else {
				$(this).addClass("on");
				$("#header .menu").addClass("on");
				if(ac.length){
					ac.prependTo('nav#gnb');
				}
				$("body").append('<div id="dimmed" />').on("click", "#dimmed", function(){
					$(".mobile-menu").click();
				});
			}
		});

		$(window).resize(function(){
			if ( $(".menu.on").length ){
				if ( $("#dimmed").length ){
					$("#dimmed").remove();
				}
				if ( $(".mobile-menu").hasClass("on") ){
					$(".mobile-menu").click();
				}
			}
			checkMobile();
			if(!$is_mobile){
				$('#content').css('width',parseInt($('.container').css('width'))-320);
			}else{
				$('#content').css('width','');
			}
		});

		$(window).scroll(function(){
			var height = $(window).scrollTop();
			if ( $('.btn-top').length ){
				if(height > 0){
					$('.btn-top').removeClass('hideanim');
				}else{
					$('.btn-top').addClass('hideanim');
				}
			}
		});

		$(document).on("click", "#header .search", function(){
			if ( !$(this).hasClass("on") ){
				$(this).addClass("on").find("input").focus();
				return false;
			}
		});
		$(document).on("click", ".close-search", function(){
				$("#header .search").removeClass("on").find("input").focus();
				return false;
		});
	}

	function coverSlider(){
		$(".cover-slider").each(function(){
			
			var $this = $(this), //현재 슬라이드 이너 객체
				$sliderItems = $(this).find("li"), //슬라이드 아이템들 객체 리스트
				$itemsLength = $sliderItems.length, //슬라이드 아이템 갯수
				$num = 0, //슬라이드 인덱스
				$looper = null; //슬라이드 인터벌 타이머 객체
				$interval = 5000;// 슬라이드 이동 간격
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
				
				//set slider item index text
				$this.find('.index').each(function(idx){
					$(this).html((idx+1)+'/'+$itemsLength)
				})
				
				//set cover slider height
				$(".cover-slider").find("ul").height( $sliderItems.eq($num).height() );
	
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
					return setInterval(
						function autoScrollSlider(){
							$($this).find('.next').trigger( "click" );
						}, $interval
					);
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
			}
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

	function postListType(){
		var cookie = document.cookie;

		if ( !getCookie('post-type') && !$("body").hasClass("post-type-thumbnail") ){
			$(".post-header .list-type .list").addClass("current");
		}

		if ( $("body").hasClass("post-type-thumbnail") ){
			$(".post-header .list-type .thum").addClass("current").siblings().removeClass("current");
		} else {
			$(".post-header .list-type .list").addClass("current").siblings().removeClass("current");
		}
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
						setDateFormat();
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

	gnb();
	

	if ( $(".cover-slider").length ){
		coverSlider();
		setInterval(	
			function autoScrollSlider(){
				$( ".next" ).trigger( "click" );
			}, 4000);
	}
	
	
	if ( $(".cover-masonry").length ) coverMasonry();
	if ( $(".post-header .list-type").length ) postListType();
	if ( $(".pagination").length ) viewMore();
	if ( $(".entry-content").length ){
		mobileTable();
		iframeWrap();
	}

	$(window).resize(function(){
		mobileTable();
		setMobileCategory();		
	});

	if($is_mobile && $(".post-item").length > 0){
		//모바일이면 뷰포트 호버 온
		$.fn.isInViewport = function() {
			var elementTop = $(this).offset().top;
			var elementBottom = elementTop + $(this).outerHeight();
		
			var viewportTop = $(window).scrollTop()+200;
			var viewportBottom = viewportTop + $(window).height()-550;
			return elementBottom > viewportTop && elementTop < viewportBottom;
		};		
	}

	//모바일기기체크 - @media로 체크
	function checkMobile(){
		if( $('.mobile-menu').css('display')=='block') {
			$is_mobile = true;
		}else{
			$is_mobile = false;
		}
	}

	function setDateFormat(){
		checkMobile();
		var today = new Date();
		var todayymd = today.toISOString().replace(/-/gi,'.').substring(0,10);
		$(".date").each(function(){
			if($(this).html().length<20){
				$(this).html(($(this).html().replace(/. /gi,'.')).substring(0,10))
			}
		})	
	}
	function setNoImage(){
		$(".post-item").each(function(){
			if(!$(this).find('.thum img').length){
				$(this).find('.thum').append('<img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7">');
				$(this).addClass('noimage');
			}
		})	
	}

	function setMobileCategory(){
		if($('#header .category-menu').css('display') == 'none'){
			if($('.category-menu > .inner > .category').length){
				$('#wrap_etc').prepend($('<div id="mobile_category" class="box_aside"><div class="tit_aside">Category</div></div>'));
				$('.category-menu > .inner > .category').detach().appendTo('#mobile_category');
			}
		}else{
			if($('#wrap_etc > #mobile_category').length){
				$('#mobile_category .category').detach().prependTo('.category-menu > .inner');
				$('#mobile_category').remove();
			}
		}
	}

	$('.btn-top').click(function(){
		$("html, body").animate({ scrollTop: 0 }, 600);
		return false;
	});

	//배경 컬러값을 사이드바 메뉴에 설정
	$('div.menu').css('background-color',$('body').css('background-color'));

})(jQuery);
