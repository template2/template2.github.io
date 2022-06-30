
(function() {
	//카테고리 및 메뉴화면 펼침 버튼
	var $wrap = $(document.body),$btnCategory = $(".area_head .btn_category"),$btnCloseCategory =  $(".btn_close");
	$btnCategory.on("click", function() {$wrap.addClass("navi_on");});
	$btnCloseCategory.on("click", function() {$wrap.removeClass("navi_on");})

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