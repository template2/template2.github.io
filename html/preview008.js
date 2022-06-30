(function() {
	//카테고리 및 메뉴화면 펼침 버튼
	var $wrap = $(".wrap_skin"),$btnCategory = $(".area_head .btn_category"),$btnCloseCategory =  $(".area_head .btn_close");
	$btnCategory.on("click", function() {$wrap.addClass("navi_on");});
	$btnCloseCategory.on("click", function() {$wrap.removeClass("navi_on");})

	//검색바 처리
	var ON_CLASS = "search_on";
	var $wrap = $(".wrap_skin"),$btnSearch = $(".area_head .btn_search"),$formSearch = $(".area_head .frm_search"),$inputSearch = $(".area_head .area_search .tf_search");

	var showSearch = function() {$wrap.addClass(ON_CLASS);$inputSearch.focus();};
	var hideSearch = function() {$wrap.removeClass(ON_CLASS);};

	$btnSearch.on("click", function(e) {showSearch();});//검색 입력바 표시
	$inputSearch.on("blur", function(e) {if ($inputSearch.val() == $inputSearch.data("value")) {hideSearch();}});//포커스 벗어날 경우 사라짐

	$(document.body).on("keydown", function(e) {if ($wrap.hasClass(ON_CLASS) && e.keyCode == 27) {$formSearch[0].reset();hideSearch();}});

	//화면 로테이션 처리
	var $window = $(window);
	var $content = $(".area_view");
	var getSize = function(value) {return (value && value.indexOf('%') < 0)? value : null};

	var adjustIframeSize = adjustIframe($content, getSize);
	adjustIframeSize();
	$window.on("orientationchange resize", adjustIframeSize);

	//비밀글쓰기 체크박스 토글처리
	toggleCheck();
})();

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

function toggleCheck() {
	$('.writer_check .lab_secret').on("click", function () { $('.lab_secret .inactive, .lab_secret .active').toggle(); });
}