(function($) {
	
	//070. Responsive Sider Buddy

	var $is_mobile = false;//모바일 기기 체크
	checkMobile()

	var bSidebarCategory = $('body.category-side').length ? true:false;//카테고리 방향 결정

	setNoImage();//이미지 없는 썸네일 배경 이미지 처리

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
		$(".cover-list figure").each(function(){
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

	//모바일기기체크 - @media로 체크
	function checkMobile(){
		//console.log($('.mobile-menu').css('position'));
		if( $('.mobile-menu').css('position') != 'absolute') {
			$is_mobile = true;
			if($('#sidebar > #header').length){
				$('#sidebar > #header').detach().prependTo('.nav');
			}
		}else{
			$is_mobile = false;
			if($('.nav > #header').length){
				$('.nav > #header').detach().prependTo('#sidebar');
			}
		}
		if (/MSIE (\d+\.\d+);/.test(navigator.userAgent) || navigator.userAgent.indexOf("Trident/") > -1 ){ 
			$is_mobile = false;
		}	
	}
	
	//모바일 메뉴 펼쳐졌으면 클릭 트리거
	function clickMobileMenu(){
		if($('.sidebar').css('display') == 'block'){
			$('.mobile-menu').trigger('click');
		}
	}

	//초기화 함수
	function gnb(){
		//모바일 메뉴 아이콘 클릭 처리
		$(".mobile-menu").on("click", function(){
			var ac = $('#sidebar');
			if ( $(this).hasClass("on") ){
				//메뉴클로즈

				//모바일 사이드 메뉴 온시 컨텐츠 스크롤 락
				//$('body').css('overflow','visible');
				$('#dimmed').off('scroll touchmove touchend mousewheel');

				if(ac.length){
					ac.removeClass('on');
				}
				$(this).removeClass("on");
				if(!$('.btn-top').hasClass('hideanim')){
					$('.nav').addClass("on");
				}
				$("#dimmed").remove();
				if($('#sidebar > #header').length){
					$('#sidebar > #header').detach().prependTo('.nav');
				}

			} else {
				//메뉴오픈
				$(this).addClass("on");
				$('.nav').removeClass("on");
				if(ac.length){
					ac.addClass('on');
				}

				$("body").append('<div id="dimmed" />').on("click", "#dimmed", function(){
					$(".mobile-menu").click();
				});

				if($('.nav > #header').length){
					$('.nav > #header').detach().prependTo('#sidebar');
				}

				//모바일 사이드 메뉴 온시 컨텐츠 스크롤 락 해제
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
