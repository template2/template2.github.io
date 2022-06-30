//카테고리 펼침 버튼
(function() {
	var $wrapnavi = $(document.body),$btnCategory = $(".area_head .btn_category"),$btnCloseCategory =  $(".area_head .btn_close");
	$btnCategory.on("click", function() {$wrapnavi.toggleClass("navi_on");});
	$btnCloseCategory.on("click", function() {$wrapnavi.removeClass("navi_on");})

	var ON_CLASS = "search_on";
	var $wrapsearch = $(".wrap_skin"),$btnSearch = $(".area_head .btn_search"),$formSearch = $(".area_head .frm_search"),$inputSearch = $(".area_head .area_search .tf_search");

	var showSearch = function() {$wrapsearch.addClass(ON_CLASS);$inputSearch.focus();};
	var hideSearch = function() {$wrapsearch.removeClass(ON_CLASS);};

	$btnSearch.on("click", function(e) {showSearch();});//검색 입력바 표시
	$inputSearch.on("blur", function(e) {if ($inputSearch.val() == $inputSearch.data("value")) {hideSearch();}});//포커스 벗어날 경우 사라짐

	$(document.body).on("keydown", function(e) {if ($wrapsearch.hasClass(ON_CLASS) && e.keyCode == 27) {$formSearch[0].reset();hideSearch();}});

	var $window = $(window);
	var $content = $(".area_view");
	var getSize = function(value) {return (value && value.indexOf('%') < 0)? value : null};

	var adjustIframeSize = adjustIframe($content, getSize);
	adjustIframeSize();
	$window.on("orientationchange resize", adjustIframeSize);

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

//메이슨리
if($('.grid-item').length == 0){
	$('.grid').removeClass('grid');
}
var $grid = $('.grid').masonry({
  // options
  itemSelector: '.grid-item',
	columnWidth: 0,
	fitWidth: true,
	horizontalOrder: true
});
//메이슨리 레이아웃 유지용
$grid.imagesLoaded().progress( function() {
  $grid.masonry('layout');
});