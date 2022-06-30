(function($) {

	setTimeLine();
	
	function gnb(){
		$("#header").on("click", ".mobile-menu", function(){
			if ( $(this).hasClass("on") ){
				$(this).removeClass("on");
				$("#header .menu").removeClass("on");
				$("#dimmed").remove();
			} else {
				$(this).addClass("on");
				$("#header .menu").addClass("on");
				$("body").append('<div id="dimmed" />').on("click", "#dimmed", function(){
					$(".mobile-menu").click();
				});
			}
		});

		$(window).resize(function(){
			if ( $("#gnb").css("position") == "relative" ){
				if ( $("#dimmed").is(":visible") ){
					$("#dimmed").remove();
				}
				if ( $(".mobile-menu").hasClass("on") ){
					$(".mobile-menu").click();
				}
			}
		});

		$(document).on("click", "#header .search", function(){
			if ( !$(this).hasClass("on") ){
				$(this).addClass("on").find("input").focus();
				return false;
			}
		});
	}

	function coverSlider(){
		var $slider = $(".cover-slider");

		$slider.each(function(){
			var $this = $(this),
				$sliderItem = $(this).find("li"),
				itemLength = $sliderItem.length,
				num = 0;

			if ( itemLength >= 1 ){
				$this.prepend('<button type="button" class="prev"><span>이전</span></button><button type="button" class="next"><span>다음</span></button>');
				$slider.find("ul").height( $sliderItem.eq(num).height() );
				$sliderItem.css({
					"position": "absolute",
					"top": 0,
				});
				$sliderItem.eq(num).siblings().css("left","100%");

				$this.on("click", ".prev", function(){
					if ( !$sliderItem.eq(num).is(":animated") ){
						$sliderItem.eq(num).animate({ left: "100%" }, 500 ).siblings().css("left","-100%");
						num = num-1 < 0 ? $sliderItem.length-1 : num-1;
						slideMove();
					}
				});

				$this.on("click", ".next", function(){
					if ( !$sliderItem.eq(num).is(":animated") ){
						$sliderItem.eq(num).animate({ left: "-100%" }, 500 ).siblings().css("left","100%");
						num = num+1 >= $sliderItem.length ? 0 : num+1;
						slideMove();
					}
				});

				function slideMove(){
					$sliderItem.eq(num).animate({ left: "0" }, 500 );
					$(".cover-slider .paging button").eq(num).addClass("current").siblings().removeClass("current");
				}

				$this.on("touchstart", function(){
					var touch = event.touches[0];
					touchstartX = touch.clientX,
					touchstartY = touch.clientY;
				});

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
					$(".pagination").append('<a href="'+nextUrl+'" class="btn view-more">목록 더보기</a>');
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
						setTimeLine();
						viewMoreShow();
					} else {
						$(".pagination").remove();
					}
				});
			}
		} else {
			var current_num = $(".pagination .selected").text(),
				total_num = $(".pagination .next").length ? $(".pagination .next").prev().text() : $(".pagination a:last").text();

			$(".pagination").append('<span class="current">'+current_num+'/'+total_num+'</span>');
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
	if ( $(".cover-slider").length ) coverSlider();
	if ( $(".cover-masonry").length ) coverMasonry();
	if ( $(".post-header .list-type").length ) postListType();
	if ( $(".pagination").length ) viewMore();
	if ( $(".entry-content").length ){
		mobileTable();
		iframeWrap();
	}

	$(window).resize(function(){
		mobileTable();
	});

	//모바일 스크롤 오버 처리
	var $is_mobile = false;
	checkMobile()

	if($is_mobile && $(".post-item").length > 0 && $('body').hasClass('color-mono')){
		//모바일이면 뷰포트 호버 온
		$.fn.isInViewport = function() {
			var elementTop = $(this).offset().top;
			var elementBottom = elementTop + $(this).outerHeight();
		
			var viewportTop = $(window).scrollTop()+200;
			var viewportBottom = viewportTop + $(window).height()-550;
			return elementBottom > viewportTop && elementTop < viewportBottom;
		};
		
		$(window).on('resize scroll', function() {
			$('.thum img').each(function() {
				if ($(this).isInViewport()) {
					$(this).removeClass('invisible');
					$(this).addClass('visible');
				} else {
					$(this).removeClass('visible');
					$(this).addClass('invisible');
				}
			});
		});
	}

	//모바일기기체크 - @media로 체크
	function checkMobile(){
		if( $('#header h1 a').css('display')=='block') {
			$is_mobile = true;
		}else{
			$is_mobile = false;
		}
	}

	function setTimeLine(){
		$(".timeline:nth-child(2n) > a:not('.timeline-inverted')").addClass('timeline-inverted');
		$(".timeline-date").each(function(){
			var tmp_ymd = $(this).html().split(' ');
			tmp_ymd = tmp_ymd[0];
			arr_postdate = arr_today = tmp_ymd.split('.');
			var postmd = arr_postdate[1]+'.'+arr_postdate[2];
			$(this).html('<span class="month">'+postmd.replace('.','</span><br/><span class="day">')+'</span>')
		})
	}

})(jQuery);
