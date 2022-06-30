(
	function() {
		//헤더
		var $body = $(document.body),$areaSkin = $(".wrap_skin");
		var openMenu = function() {$body.addClass("layer_on");};
		var closeMenu = function() {$body.removeClass("layer_on");};
		$areaSkin.on("click", ".btn_menu", openMenu);
		$areaSkin.on("click", ".btn_close", closeMenu);

		//프로필 메뉴
		var $areaProfile = $(".area_profile");
		var toggleProfileMenu = function() {$areaProfile.toggleClass("on");
	};

	$areaProfile.on("click", ".btn_name", toggleProfileMenu);

	//카테고리 버튼
	var $areaNavi = $(".area_navigation");
	var toggleCategory = function() {$areaNavi.toggleClass("on");};
	$areaNavi.on("click", ".btn_category", toggleCategory);

	//검색 버튼
	var $areaSearch = $(".area_search"),$input = $areaSearch.find(".tf_search");
	var openSearch = function() {$areaSearch.addClass("on");$input.focus();}
	var leaveSearch = function() {if ($input.val() == "") {$areaSearch.removeClass("on")}};
	$areaSearch.on("click", ".btn_search", openSearch);
	$input.on("blur", leaveSearch);

	//코멘트
	var $btnOpen = $(".btn_reply"),$fieldReply = $(".fld_reply");
	var changeStatus = function() {$btnOpen.toggleClass("on");};

	if ($fieldReply.is(":visible")) {$btnOpen.addClass("on");};

	//모바일 화면 로테이션 iframe 크기 조절
	var $window = $(window);
	var $content = $(".area_view");

	var getSize = function(value) {return (value && value.indexOf('%') < 0)? value : null;};

	var adjustIframeSize = function() {
		var contentWidth = $content.width();
		$content.find("iframe").each(function(i, iframe) {
			var $iframe = $(iframe),width = getSize($iframe.attr("width")),height = getSize($iframe.attr("height"));
			if (width && height) {$iframe.css({width: contentWidth + "px",height: contentWidth / width * height + "px"})};
		});
	}

	adjustIframeSize();
	$window.on("orientationchange resize", adjustIframeSize);

	//비밀글 체크박스 체크 토글 처리
	$('.writer_check .label_secret').click(function() {
		$('.label_secret .inactive, .label_secret .active').toggle();
	});

})();