//카테고리 펼침 버튼
(function() {
	
	var $wrapnavi = $(document.body),$btnCategory = $(".area_head .btn_category"),$btnCloseCategory =  $(".area_head .btn_close");
	$btnCategory.on("click", function() {$wrapnavi.toggleClass("navi_on");});
	$btnCloseCategory.on("click", function() {$wrapnavi.removeClass("navi_on");})

	var $window = $(window);
	var $content = $(".area_view");
	var getSize = function(value) {return (value && value.indexOf('%') < 0)? value : null};

	var $is_mobile = false;
	checkMobile()
	$window.on('resize',checkMobile);

	var ON_CLASS = "search_on";
	var $wrapsearch = $(".wrap_skin"),$btnSearch = $(".area_head .btn_search"),$formSearch = $(".area_head .frm_search"),$inputSearch = $(".area_head .area_search .tf_search");

	var showSearch = function() {$wrapsearch.addClass(ON_CLASS);$inputSearch.focus();};
	var hideSearch = function() {$wrapsearch.removeClass(ON_CLASS);};

	$btnSearch.on("click", function(e) {showSearch();});//검색 입력바 표시
	$inputSearch.on("blur", function(e) {if ($inputSearch.val() == $inputSearch.data("value")) {hideSearch();}});//포커스 벗어날 경우 사라짐

	$(document.body).on("keydown", function(e) {if ($wrapsearch.hasClass(ON_CLASS) && e.keyCode == 27) {$formSearch[0].reset();hideSearch();}});

	var adjustIframeSize = adjustIframe($content, getSize);
	adjustIframeSize();
	$window.on("orientationchange resize", adjustIframeSize);

	toggleCheck();

	//모바일 마우스 호버 대체 스크롤 처리
	if($('.grid-item').length == 0){
		//포스트 뷰
		$('.grid').removeClass('grid');
	}else{
		if($is_mobile){
			//모바일이면 뷰포트 호버 온
			$.fn.isInViewport = function() {
				var elementTop = $(this).offset().top;
				var elementBottom = elementTop + $(this).outerHeight();
			
				var viewportTop = $(window).scrollTop()+200;
				var viewportBottom = viewportTop + $(window).height()-550;
				return elementBottom > viewportTop && elementTop < viewportBottom;
			};
			
			$(window).on('resize scroll', function() {
				$('.data_post').each(function() {
					if ($(this).isInViewport()) {
						$(this).removeClass('invisible');
						$(this).addClass('full-visible');
					} else {
						$(this).removeClass('full-visible');
						$(this).addClass('invisible');
					}
				});
			});
		}
	}

	//메이슨리 초기화
	var $grid = $('.grid').masonry({
		// options
		itemSelector: '.grid-item',
		columnWidth: 0,
		fitWidth: true,
		horizontalOrder: true
	});

	//페이지 로딩중 메이슨리 레이아웃 유지용
	$grid.imagesLoaded().progress( function() {
		$grid.masonry('layout');
	});


	//모바일기기체크 - @media로 체크
	function checkMobile(){
		if( $('#wrap_etc').css('display')=='none') {
			$is_mobile = true;
		}else{
			$is_mobile = false;
		}
	}

	//화면 로테이션 처리
	function adjustIframe($content, getSize) {
		return function () {
			var contentWidth = $content.width();
			$content.find("iframe").each(function (_i, iframe) {
				var $iframe = $(iframe), width = getSize($iframe.attr("width")), height = getSize($iframe.attr("height"));
				if (width && height) {
					$iframe.css({ width: contentWidth + "px", height: contentWidth / width * height + "px" });
				}
			});
		};
	}

	//비밀글 체크 토글
	function toggleCheck() {
		$('.writer_check .lab_secret').on("click", function () { $('.lab_secret .inactive, .lab_secret .active').toggle(); });
	}

	var $lineheight = 22;
	$('.list_content').each(function(){
		//이미지선택해서 높이값 얻고
		//높이/22px - 3 줄을 -webkit-line-clamp 에 css 적용해서 처리
		var $lines = parseInt(this.clientHeight / $lineheight);
		$lines = $lines > 5 ? $lines - 5:$lines;
		var $paragraph = $(this).find('.txt_post');
		$(this).find('.txt_post').css("-webkit-line-clamp",$lines.toString());

	})
})();
