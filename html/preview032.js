(function($) {

	//모바일 스크롤 오버 처리
	var $is_mobile = false;
	var $resizeId = "";

	checkMobile()

	setMobileCategory(); //모바일 메뉴로 카테고리 붙였다 뗌
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
			$resizeId = setTimeout(doneResizing, 500);			
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
		callbackRowMasonry()		
		$('.article-info.visible').removeClass('visible').addClass('invisible');
	}

	function getCookie(name){
		name = new RegExp(name + '=([^;]*)');
		return name.test(document.cookie) ? unescape(RegExp.$1) : '';
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
	if ( $(".entry-content").length ){
		mobileTable();
		iframeWrap();
	}

	$.fn.isInViewport = function() {
		var elementTop = $(this).offset().top;
		var elementBottom = elementTop + $(this).outerHeight();
		var viewportTop = $(window).scrollTop()+200;
		var viewportBottom = viewportTop + $(window).height()-550;
		return elementBottom > viewportTop && elementTop < viewportBottom;
	};

	$('.btn-top').click(function(){
		$("html, body").animate({ scrollTop: 0 }, 600);
		return false;
	});

})(jQuery);

$(document).ready(function(){
	//if(!$is_mobile){
		callbackRowMasonry();
	//}
	if ( $(".pagination").length ) viewMore();
})

//가로형 메이슨리 구현
//2019.03.15
//apost.kr
var callbackImgCount = 0;

function callbackRowMasonry(){
		//$("#loading_spinner").removeClass("hidden");
		$("body").append('<div id="loading_spinner"><i class="fas fa-spinner fa-pulse"></i></div>')
		$('#content > .inner > .post-item.init img').waitForImages(true).done(function() {      
			setRowMasonry(true);
			$("#loading_spinner").remove();
		});
}

function setRowMasonry(b_more){

	var today = new Date();
	var todayymd = today.toISOString().replace(/-/gi,'.').substring(0,10);

	var $glo_w = $('#content>.inner').width();
	var $glo_pad = parseInt($('#content').css('padding-left'));
	var $glo_gutter = 0;
	var $glo_col_count = 0;
	var $glo_col_sum = 0;
	var $glo_w_noimage = 250;

	var $objs = null;

	if(!b_more){
		objs = $('#content > .inner > .post-item');
	}else{
		objs = $('#content > .inner > .post-item.init');
	}
	var $glo_length = objs.length;

	objs.each(function(i,el){

		//년월일 날짜 포맷 변경
		var $d = $(this).find('.date');
		if($($d).html().length<20){
			$($d).html(($($d).html()).substring(0,10))
		}
	
		var $pos = $(el).position();
		var $b_img = $(el).find('img').length?true:false;
		var $el_w = $b_img?$(el).width():$glo_w_noimage;

		//이미지 없는 글 빈 투명 이미지 설정
		if(!$b_img){
			$(this).find('.thum').append('<img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7">');
			$(this).addClass('noimage');
		}

		//거터 크기 설정
		if(i == 0){
			$glo_gutter = parseFloat($(el).css('margin-left'));
		}

		//페이지 내 각 행 첫번째이고 첫 아이템 아니면, 또는 마지막 아이템이면
		if((Math.round($pos.left) == $glo_pad && i > 0) || i == $glo_length-1){
			//마지막 아이템 예외처리
			if(i == $glo_length-1){
				if(Math.round($pos.left) != $glo_pad){
					i++;
					$glo_col_count++;
					$glo_col_sum += $el_w;
				}else{
					//$(this).css('left',Math.round($pos.left)+'px');
					$(this).css('margin-left','0');
					$(this).css('width','100%');
					$(this).removeClass('init');
				}
			}

			//확대 배율구하기
			var $x_rate = ($glo_w-($glo_gutter*($glo_col_count-1)))/$glo_col_sum;
			
			//앞행 전체 컬럼 크기 배율 처리
			for(var loop = i-$glo_col_count;loop<i;loop++){
				
				var $nth_el = $(objs[loop]);

				if(loop == i-$glo_col_count){
					//첫번째 마진 처리
					$($nth_el).css('margin-left','0');
					$($nth_el).css('clear','left');
				}
				//각 컬럼 크기 배분 처리
				$($nth_el).css('width',($nth_el.width()*$x_rate)/$glo_w*100+'%');
				$($nth_el).removeClass('init');
				//noimage 예외처리
				if($($nth_el).hasClass('noimage')){
					$($nth_el).find('img').css('width','100%');
					$($nth_el).find('img').css('height','100%');
				}

				//오버이미지 센터 정렬 - 배율 처리후 후처리
				if($b_img && ($($nth_el).height()+10) < $($nth_el).find('img').height()){
					$($nth_el).find('img').css('margin-top','-'+(($($nth_el).find('img').height()-$($nth_el).height())/2)+'px');
				}

			}
			
			//컬럼 카운트 리셋
			$glo_col_count = 1;
			$glo_col_sum = $el_w;
		}else{
			//누적해서 그냥 넘기는 컬럼
			$glo_col_count++;
			$glo_col_sum += $el_w;
		}
	})
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
					//if(!$is_mobile){
						callbackRowMasonry();
					//}
					$(".pagination").html($paginationInner);
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

//모바일기기체크 - .container 크기값으로 모바일 구분
function checkMobile(){
	if( $('.container').css('max-width')=='100%') {
		$is_mobile = true;
	}else{
		$is_mobile = false;
	}
}

function setMobileCategory(){
	checkMobile();
	if($is_mobile){
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

function show_Article_Info() {
	$('.article-info').each(function() {
		if ($(this).isInViewport()) {
			$(this).removeClass('invisible').addClass('visible');
		} else {
			$(this).removeClass('visible').addClass('invisible');
		}
	});
}			
