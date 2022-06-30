(function($) {

	//모바일 스크롤 오버 처리
	var $is_mobile = false;
	var $resizeId = "";

	checkMobile();
	setupGrid();

	setDateFormat();//YYYY.MM.DD 포맷으로 날짜 형식 변경
	setMobileCategory(); //모바일 메뉴로 카테고리 붙였다 뗌
	setNoImage();
	setMobileScroller();

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
			$resizeId = setTimeout(doneResizing, 200);			
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

	function doneResizing(){
		
		checkMobile();
		setupGrid();

		if ( $("#gnb").css("position") == "relative" ){
			if ( $("#dimmed").is(":visible") ){
				$("#dimmed").remove();
			}
			if ( $(".mobile-menu").hasClass("on") ){
				$(".mobile-menu").click();
			}
		}
		mobileTable();
		setMobileCategory();
		setMobileScroller();
		$('.article-info.visible').removeClass('visible').addClass('invisible');
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
						//$($nextPostItem).hide(); //결과 page-item 리스트 감춤 - display:none;으로 붙음.
						$("#content").append('<div class="inner"></div>');
						$("#content > .inner:last-child").append($nextPostItem);
						setNoImage();
						setDateFormat();
						$(".pagination").html($paginationInner);
						$('.pagination').detach().appendTo('#content');
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

	if ( $(".post-header .list-type").length ) postListType();
	if ( $(".pagination").length ) viewMore();
	if ( $(".entry-content").length ){
		mobileTable();
		iframeWrap();
	}

	//모바일기기체크 - .container 크기값으로 모바일 구분
	function checkMobile(){
		if( $('.container').css('max-width')=='100%') {
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
			if($(this).html().length > 10){
				$(this).html(($(this).html().replace(/. /gi,'.')).substring(0,10))
			}
		})	
	}

	function setNoImage(){
		$(".post-item.init").each(function(){
			if($(this).css('background-image') == 'none'){
				$(this).find('.thum').append('<img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7">');
			}
			$(this).removeClass('init');
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

	function setMobileScroller(){
		if($is_mobile && $(".post-item").length > 0){
			$(window).on('resize scroll', show_Article_Info);
		}else{
			$(window).off('resize scroll', show_Article_Info);
		}
	}

	$.fn.isInViewport = function() {
		var elementTop = $(this).offset().top;
		var elementBottom = elementTop + $(this).outerHeight();
		var viewportTop = $(window).scrollTop()+200;
		var viewportBottom = viewportTop + $(window).height()-550;
		return elementBottom > viewportTop && elementTop < viewportBottom;
	};

	function show_Article_Info() {
		checkMobile();
		$('.post-item').each(function() {
			if ($is_mobile && $(this).isInViewport()) {
				$(this).removeClass('invisible').addClass('visible');
			} else {
				$(this).removeClass('visible').addClass('invisible');
			}
		});
	}			

	//그리드 온오프
	function setupGrid(){
		if($is_mobile || $('.hgroup').length || $('.entry-content').length || $('#entry0Comment').length || window.location.pathname == "/location"){
			$('body').removeClass('grid');
		}else{
			$('body').addClass('grid');
		}
	}

	$('.btn-top').click(function(){
		$("html, body").animate({ scrollTop: 0 }, 600);
		return false;
	});

})(jQuery);
