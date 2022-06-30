(function($) {

	// 105 Responsive Cactus

	var $itemindex = 0;
	var $is_mobile = false;//모바일 기기 체크
	checkMobile(); // 모바일 체크

	var bSidebarCategory = $('body.category-side').length ? true:false;//카테고리 방향 결정

	setMobileCategory(); //모바일 메뉴로 카테고리 붙였다 뗌
	setNoImage(); //이미지 없는 썸네일 배경 이미지 처리
	checkSearchBar(); //검색바 감춤처리

	//쿠키 얻기
	function getCookie(name){
		name = new RegExp(name + '=([^;]*)');
		return name.test(document.cookie) ? unescape(RegExp.$1) : '';
	}

	//더보기 버튼으로 페이징
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

	// 모바일에서 테이블 감싸서 스와이프로 볼 수 있게 함.
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

	//모바일에서 아이프레임 감싸서 스와이프로 볼 수 있게 함.
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
		$(".post-item, .recent-posts > li, .cover-list ul li").each(function(){
			if(!$(this).find('.thum img').length){
				if($('body.place-thumbnail').length){
					$(this).find('.thum').append('<img src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==">');
					$(this).addClass('noimage');
				}else{
					$(this).find('.thum').removeClass('thum');
				}
			}
		})	
	}

	//모바일기기체크 - @media로 체크
	function checkMobile(){
		if( $('#sidebar').css('display') == 'none' ) {
			$is_mobile = true;
		}else{
			$is_mobile = false;
		}
		if ( (/MSIE (\d+\.\d+);/.test(navigator.userAgent) || navigator.userAgent.indexOf("Trident/") > -1) && $(window).width() > 1023 ){ 
			$is_mobile = false;
		}
	}

	//모바일 사이드바로 카테고리 이동
	function setMobileCategory(){
		if($('#header .category-menu').css('display') == 'none' || bSidebarCategory || $is_mobile){
			if($('.category-menu > .inner > .category').length){
				if($('#profile').length){
					$('#profile').after($('<div id="mobile_category" class="box_aside"><div class="tit_aside">Category</div></div>'));
				}else{
					$('#wrap_sidebar1').prepend($('<div id="mobile_category" class="box_aside"><div class="tit_aside">Category</div></div>'));
				}
				$('.category-menu > .inner > .category').detach().appendTo('#mobile_category');
			}
			$('#header .category').css('display','block');
		}else{
			if($('#wrap_sidebar1 > #mobile_category').length){
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

	//모바일 사이드바 이동
	function modeSidebar(){
		if($is_mobile){
			//사이드바1 헤더로 이동
			if($('#sidebar #wrap_sidebar1').length){
				$('#wrap_sidebar1').detach().prependTo('#header_sidebar .inner');
				$('#header_sidebar').show();
			}
		}else{
			//사이드바1 사이드로 이동
			if($('#header_sidebar #wrap_sidebar1').length){
				$('#wrap_sidebar1').detach().prependTo('#sidebar .inner');
			}
		}		
	}

	//초기화 함수
	function gnb(){
		//모바일 메뉴 아이콘 클릭 처리
		$(".mobile-menu").on("click", function(){
			
			modeSidebar();

			if ( $(this).hasClass("on") ){
				//모바일 사이드 메뉴 온시 컨텐츠 스크롤 락 해제
				//$('body').css('overflow','visible');
				$('#dimmed').off('scroll touchmove touchend mousewheel');

				$('.search').show();
				$('#header > .title').show();
				//$('#header > .category-menu').show();
				$(this).removeClass("on");
				$("#header .menu").removeClass("on");
				$("#dimmed").remove();
				if(!$('.hideanim').length){
					$("#header").addClass("on");
				}
				$('.box_header_wrap').detach().appendTo('#header');
			} else {
				$('.search').hide();
				$('#header > .title').hide();
				//$('#header > .category-menu').hide();
				$(this).addClass("on");
				$("#header .menu").addClass("on");
				$('#header').removeClass('on');
				$("body").append('<div id="dimmed" />').on("click", "#dimmed", function(){
					$(".mobile-menu").click();
				});
				$('.box_header_wrap').detach().prependTo('#gnb');

				//모바일 사이드 메뉴 온시 컨텐츠 스크롤 락
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
			modeSidebar();
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
			if ( !$('.menu').hasClass("on") ){
				if($(window).scrollTop() > 100){
					$('#header').addClass('on');
				}else{
					$('#header').removeClass('on');
				}
			}
		});

		//1단 검색버튼
		$(document).on("click", "#wrap .search", function(){
			if ( !$(this).hasClass("on") ){
				$(this).addClass("on").find("input").focus();
				$('.mobile-menu.on').click();
				if($is_mobile){ $('#header:not(.on) .social-link-wrap').hide(); }
				return false;
			}
		});
		//검색박스 닫기 버튼 클릭 처리
		$(document).on("click", ".close-search", function(){
			$("#wrap .search").removeClass("on").find("input").focus();
			$('.social-link-wrap').show();
			return false;
		});
	}//gnb

	gnb();

	//탑으로 애니메이션 스크롤 하는 버튼
	if($('.btn-top').length){
		$('.btn-top').click(function(){
			$("html, body").animate({ scrollTop: 0 }, 600);
			return false;
		});
	}

	if ( $(".paging-view-more").length ) viewMore();

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
