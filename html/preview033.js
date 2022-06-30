(function($) {

	//모바일 스크롤 오버 처리
	var $is_mobile = false;
	var $resizeId = "";

	var $masonry_col_count = 3;
	var $masonry_item_w = 400;
	var $masonry_gutter = 10;
	var $masonry_height = 0;
	var $masonry_nextpos = [];
	for(var j = 0;j < $masonry_col_count;j++){
		$masonry_nextpos.push(new Object({x:0,y:0}));
	}

	checkMobile()

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
			$resizeId = setTimeout(doneResizing, 100);			
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
		callbackGridMasonry(false);
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
						$("#content > .inner").append($nextPostItem);
						$(".pagination").html($paginationInner);
						callbackGridMasonry(true);
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
			if($(this).html().length<20){
				$(this).html(($(this).html().replace(/. /gi,'.')).substring(0,10))
			}
		})	
	}

	function setNoImage(){
		$(".post-item .thum").each(function(){
			if(!$(this).find('img').length){
				$(this).append('<img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7">');
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
			$('.article-info').each(function() {
				if ($(this).isInViewport()) {
					$(this).removeClass('invisible').addClass('visible');
				} else {
					$(this).removeClass('visible').addClass('invisible');
				}
		});
	}			

	$('.btn-top').click(function(){
		$("html, body").animate({ scrollTop: 0 }, 600);
		return false;
	});

	//이미지 로딩 콜백
	function callbackGridMasonry(b_more){
		//$("#loading_spinner").removeClass("hidden");
		$("body").append('<div id="loading_spinner"><i class="fas fa-spinner fa-pulse"></i></div>')
		$('#content > .inner > .post-item.init img').waitForImages(true).done(function() {      
			$("#loading_spinner").remove();
			setGridMasonry(b_more);
		});
	}

	//그리드 메이슨리 높이 정렬
	function setGridMasonry(b_more){
		
		var $glo_itemcount = 0;

		$('body').css('overflow-y', 'scroll')
		var $glo_w = $('#content>.inner').width();
		var $glo_pad = parseInt($('#content').css('padding-left'));
		$masonry_height = 0;
		
		var $col_count = Math.ceil($glo_w / $masonry_item_w);//글로벌 변수
		if(!b_more){
			$masonry_col_count = $col_count;
			$masonry_nextpos = [];
			for(var j = 0;j < $masonry_col_count;j++){
				$masonry_nextpos.push(new Object({x:0,y:0}));
			}
		}

		var $glo_col_sum = 0;
		var $glo_w_noimage = 250;

		var $objs = null;

		//추가로딩 여부에 따른 아이템 목록 얻기
		if(!b_more){
			objs = $('#content > .inner > .post-item');
		}else{
			objs = $('#content > .inner > .post-item.init');
			$glo_itemcount = $('#content .post-item').length-$('#content .post-item.init').length;
		}
		var $glo_length = objs.length;		

		//위치 지정
		objs.each(function(i,el){
			var $pos = $(el).position();
			var $b_img = $(el).find('img').length?true:false;
			var $el_w = $b_img?$(el).width():$glo_w_noimage;
	
			//이미지 없는 글 빈 투명 이미지 설정
			if(!$b_img){
				$(this).find('.thum').append('<img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7">');
				$(this).addClass('noimage');
			}
	
			$(this).css('width',100/$masonry_col_count+"%");
			$(this).removeClass('init');
				
			//이미지 수직 센터 정렬
			if($b_img && ($(this).height()+10) < $(this).find('img').height()){
				$(this).find('a').css('margin-top','-'+(($(this).find('img').height()-$(this).height())/2)+'px');
			}

			//위치 지정
			var fixed_i = $glo_itemcount+i;
			$(this).css('margin-left',(100*((fixed_i)%$masonry_col_count)/$masonry_col_count)+"%");
			$(this).css('top',$masonry_nextpos[(fixed_i)%$masonry_col_count].y);
			$masonry_nextpos[(fixed_i)%$masonry_col_count].y += $(this).height();

			//최대 길이 체크
			if($masonry_height < $masonry_nextpos[fixed_i%$masonry_col_count].y){
				$masonry_height = $masonry_nextpos[fixed_i%$masonry_col_count].y;
			}
		});

		//전체 높이 설정
		if($('#content .post-item').length){
			$('#content').height($masonry_height);
		}
	
	}

	callbackGridMasonry(false);

})(jQuery);
