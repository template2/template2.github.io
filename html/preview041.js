(function($) {

	//모바일 스크롤 오버 처리
	var $is_mobile = false;
	var $resizeId = "";

	checkMobile();
	setDateFormat();//YYYY.MM.DD 포맷으로 날짜 형식 변경
	setMobileCategory(); //모바일 메뉴로 카테고리 붙였다 뗌
	setNoImage();
	setCoverPage();

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
			clearTimeout($resizeId);
			$resizeId = setTimeout(doneResizing, 150);		
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
		$(".cover-slider .inner").each(function(){
			var $this = $(this),
				$sliderItem = $(this).find("li"),
				itemLength = $sliderItem.length,
				num = 0;

			if ( itemLength >= 1 ){
				$this.append('<button type="button" class="prev"><span>이전</span></button><button type="button" class="next"><span>다음</span></button>');
				$this.find('.index').each(function(idx){
					$(this).html((idx+1)+'/'+itemLength)
				})
				//커버슬라이더 높이 설정
				$(".cover-slider .inner").find("ul").height( $sliderItem.eq(num).height() );

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

	//창크기 변경시 사이드바 메뉴 닫기
	function doneResizing(){
		checkMobile();
		if ( $(".mobile-menu.on").length ){
			if ( $("#dimmed").is(":visible") ){
				$("#dimmed").remove();
			}
			if ( $(".mobile-menu").hasClass("on") ){
				$(".mobile-menu").click();
			}
		}
		mobileTable();
		setMobileCategory();
		setCoverPage();
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
				$(this).find('.thum').append('<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAACCAQAAAA3fa6RAAAADklEQVR42mNkAANGCAUAACMAA2w/AMgAAAAASUVORK5CYII=">');
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

	function setCoverPage(){
		if($('[class*="cover-"]').length && $("body.fullcover").length){
			if($('.cover-slider').length){
				$('.cover-slider').detach().appendTo('#header');
			}
		}
	}
	
	$('.btn-top').click(function(){
		$("html, body").animate({ scrollTop: 0 }, 600);
		return false;
	});

	//다이어리 구현
	$tds = $('.tt-calendar td.cal_day').clone();
	$($tds).appendTo('#diary>.inner');
	$('#diary .cal_day').each(function() {
		$(this).replaceWith($('<div/>').html($(this).html()));
	});
	$pns = $('.tt-calendar .cal_month a').clone();
	$($pns[0]).prependTo('#diary>.inner').addClass('prev');
	$($pns[1]).prependTo('#diary>.inner').addClass('ymd');
	$($pns[2]).appendTo('#diary>.inner').addClass('next');

	var $pathname = window.location.pathname;
	$('#diary > .inner > div > a').each(function(){
		if($(this).attr('href') == $pathname){
			$(this).addClass('current');
		}
	})
})(jQuery);
