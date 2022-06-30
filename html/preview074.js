(function($) {

	// 074 Responsive RetroLine

	var $is_mobile = false;//모바일 기기 체크
	checkMobile()

	var bSidebarCategory = $('body.category-side').length ? true:false;//카테고리 방향 결정

	setMobileCategory(); //모바일 메뉴로 카테고리 붙였다 뗌
	setNoImage();//이미지 없는 썸네일 배경 이미지 처리
	checkSearchBar();

	if($is_mobile && $(".cover-list ul li, .post-item").length > 0){
		//모바일이면 뷰포트 호버 온
		$.fn.isInViewport = function() {
			var elementTop = $(this).offset().top;
			var elementBottom = elementTop + $(this).outerHeight();
		
			var viewportTop = $(window).scrollTop()+200;
			var viewportBottom = viewportTop + $(window).height()-550;
			return elementBottom > viewportTop && elementTop < viewportBottom;
		};
		
		$(window).on('scroll', function() {
			$('.post-item .thum img, .cover-list ul li figure img').each(function() {
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
						$("#content .inner").append($nextPostItem);
						$(".pagination").html($paginationInner);
						setNoImage();						
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
	//이미지 없는 썸네일 자리 채우기용 투명 이미지 태그 붙이기
	function setNoImage(){
		$(".cover-list ul li figure").each(function(){
			if(!$(this).find('img').length){
				$(this).append('<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAACCAQAAAA3fa6RAAAADklEQVR42mNkAANGCAUAACMAA2w/AMgAAAAASUVORK5CYII=">');
				$(this).addClass('noimage');
			}
		});
		$(".post-item, .recent-posts > li").each(function(){
			if(!$(this).find('.thum img').length){
				if($('body.place-thumbnail').length){
					$(this).find('.thum').append('<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAACCAQAAAA3fa6RAAAADklEQVR42mNkAANGCAUAACMAA2w/AMgAAAAASUVORK5CYII=">');
					$(this).addClass('noimage');
				}else{
					$(this).find('.thum').removeClass('thum');
				}
			}
		})	
	}

	//모바일기기체크
	function checkMobile(){
		if( $(window).width() <= 1023) {
			$is_mobile = true;
		}else{
			$is_mobile = false;
		}
	}

	//모바일 사이드바로 카테고리 이동
	function setMobileCategory(){
		if($('#header .category-menu').css('display') == 'none' || bSidebarCategory || $is_mobile){
			if($('.category-menu > .inner > .category').length){
				$('#wrap_etc').prepend($('<div id="mobile_category" class="box_aside"><div class="tit_aside">Category</div></div>'));
				$('.category-menu > .inner > .category').detach().appendTo('#mobile_category');
			}
			$('#header .category').css('display','block');
		}else{
			if($('#wrap_etc > #mobile_category').length){
				$('#mobile_category .category').detach().prependTo('.category-menu > .inner');
				$('#mobile_category').remove();
			}
		}
	}
	
	//모바일 메뉴 펼쳐졌으면 클릭 트리거
	function clickMobileMenu(){
		if($('.sidebar').css('display') == 'block'){
			$('.mobile-menu').trigger('click');
		}
	}

	//검색폼 펼쳐졌으면 감춤 처리
	function checkSearchBar(){
		if($is_mobile && $('.search.on').length){
			//모바일이면 검색 펼침 닫기
			$('.search.on').removeClass('on');
			$('.search .attach').removeClass('attach');
		}		
	}

	//초기화 함수
	function gnb(){

		//모바일 메뉴 아이콘 클릭 처리
		$(".mobile-menu").on("click", function(){
			var ac = $('#sidebar').detach();
			if ( $(this).hasClass("on") ){
				//모바일 사이드 메뉴 온시 컨텐츠 스크롤 락
				//$('body').css('overflow','visible');
				$('#dimmed').off('scroll touchmove touchend mousewheel');

				if(ac.length){
					ac.prependTo('#wrap .container');
				}
				$(this).removeClass("on");
				if(!$('.btn-top').hasClass('hideanim')){
					$('.nav').addClass("on");
				}				
				$("#header .menu").removeClass("on");
				$("#dimmed").remove();
				$('.box_header_wrap').detach().appendTo('#header');
			} else {
				$('.search').removeClass("on");
				$(this).addClass("on");
				$('.nav').removeClass("on");				
				$("#header .menu").addClass("on");
				if(ac.length){
					ac.appendTo('nav#gnb');
				}
				$("body").append('<div id="dimmed" />').on("click", "#dimmed", function(){
					$(".mobile-menu").click();
				});
				$('.box_header_wrap').detach().prependTo('#gnb');

				//모바일 사이드 메뉴 온시 컨텐츠 스크롤 락 해제
				//$('body').css('overflow','hidden');
				$('#dimmed').on('scroll touchmove touchend mousewheel', function(e){
					e.preventDefault();
					e.stopPropagation();
					return false;
				});				
			}
		});

		//리사이즈 처리
		$(window).resize(function(){
			checkMobile();
			setMobileCategory();
		});

		//스크롤시 모바일 사이드바 펼침 닫기 처리
		$(window).scroll(function(){
			var height = $(window).scrollTop();
			if ( $('.btn-top').length ){
				if(height > 0){
					$('.btn-top').removeClass('hideanim');
				}else{
					$('.btn-top').addClass('hideanim');
				}
			}
			if($is_mobile){
				if($(window).scrollTop() > 100){
					$('.nav').addClass('on');
				}else{
					$('.nav').removeClass('on');
				}
			}else{
				if($('.nav').length){
					$('.nav').removeClass('on');
				}
			}
		});
		//1단 검색버튼
		$(document).on("click", "#wrap .search", function(){
			if ( !$(this).hasClass("on") ){
				$(this).addClass("on").find("input").focus();
				$('.mobile-menu.on').click();
				return false;
			}
		});
		//검색박스 닫기 버튼 클릭 처리
		$(document).on("click", ".close-search", function(){
				$("#wrap .search").removeClass("on").find("input").focus();
				return false;
		});
		//사이드바 좌우 표시할 경우 검색 박스 위치 조정
		if($("body.sidebar-left, body.sidebar-right").length && $("#wrap .search").length){
			if($('#profile').length){
				$('#profile').after($('<div id="sidebar-search"></div>'));
			}else{
				$('#sidebar > inner').prepend($('<div id="sidebar-search"></div>'));
			}
			$('#wrap .search').detach().appendTo('#sidebar-search');
		}

	}//gnb

	gnb();

	//탑으로 애니메이션 스크롤 하는 버튼
	if($('.btn-top').length){
		$('.btn-top').click(function(){
			$("html, body").animate({ scrollTop: 0 }, 600);
			return false;
		});
	}

	//커버 슬라이더 높이 설정
	if ( $(".cover-slider").length ){
		coverSlider();
		if($('body.cover-slider-header').length && $('.cover-slider').length){
			$('.cover-slider').detach().appendTo('#header');
			if($is_mobile){
				if($('body.mobile-small-cover-slider').length){
					$('#header').css('height','290px');
				}else{
					$('#header').css('height','400px');
				}
			}else{
				if($('body.category-side').length){
					$('#header').css('height','400px');
				}else{
					$('#header').css('height','444px');
				}
			}
		}
	}else{
		//커버 슬라이더 없으면 설정클래스 소거
		if($('body.cover-slider-header').length){
			$('body').removeClass('cover-slider-header');
		}
	}

	if ( $(".cover-masonry").length ) coverMasonry();
	if ( $(".paging-view-more").length ) viewMore();
	if( $(".cover-thumbnail-list, .cover-gallery").length ){
		$(".cover-thumbnail-list, .cover-gallery").each(function(){
				var len = $(this).find('ul li').length;
				$(this).addClass('type'+(len>4?parseInt(len/2):len));
		});
	}

	// 링크없는 더보기 감춤
	$('a.text-box').each(function(){
		if($(this).attr('href') == "" || $(this).attr('href').toLowerCase() == "http://" || $(this).attr('href').toLowerCase() == "https://"){
			$(this).remove();
		}
	});

	//강제 크기 정해진 테이블이나 아이프레임 모바일 대응되도록 처리
	if ( $(".entry-content").length ){
		mobileTable();
		iframeWrap();
	}
})(jQuery);
