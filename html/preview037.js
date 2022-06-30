(function($) {

	//모바일 스크롤 오버 처리
	var $is_mobile = false;
	var $resizeId = "";

	// 포토폴리오 슬라이드 페이지 외 접근 차단
	/*
	if($('.hgroup').length || $('.entry-content').length || $('#entry0Comment').length || window.location.pathname == "/location"){
		location.href = '/';
	}else{
		$('body').css('display','block');
	}
	*/

	checkMobile()

	setDateFormat();//YYYY.MM.DD 포맷으로 날짜 형식 변경
	setMobileCategory(); //모바일 메뉴로 카테고리 붙였다 뗌

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
				$("#header").append('<div id="dimmed" />').on("click", "#dimmed", function(){
					$(".mobile-menu").click();
				});
				if($('.pagination.activ').length){
					$('.btn-unfold').click();
				}
			}
		});

		$(window).resize(function(){
			clearTimeout($resizeId);
			$resizeId = setTimeout(doneResizing, 100);			
		});

		//검색 펼침
		$(document).on("click", "#header .search", function(){
			if ( !$(this).hasClass("on") ){
				$(this).addClass("on").find("input").focus();
				return false;
			}
		});
		//사이드바 닫기
		$(document).on("click", ".close-search", function(){
				$("#header .search").removeClass("on").find("input").focus();
				return false;
		});
	}

	//창크기 변경시 사이드바 메뉴 닫기
	function doneResizing(){
		checkMobile();
		if ( $(".mobile-menu.on").length ){
			if ( $("#dimmed").is(":visible") ){
				$("#dimmed").remove();
			}
			if ( $(".mobile-menu").hasClass("on") ){
				$(".mobile-menu").click();
			}
		}
		mobileTable();
		setMobileCategory();
	}

	function getCookie(name){
		name = new RegExp(name + '=([^;]*)');
		return name.test(document.cookie) ? unescape(RegExp.$1) : '';
	}

	function coverSlider(){
		var $slider = $('#content .inner'),
			$sliderItems = $($slider).find(".post-item"),
			itemLength = $sliderItems.length,
			num = 0;

		if ( itemLength > 1 ){
			$slider.append('<button type="button" class="prev"><span>이전</span></button><button type="button" class="next"><span>다음</span></button>');
			$slider.find('.index').each(function(idx){
				$(this).html((idx+1)+'/'+itemLength)
			})
			
			$sliderItems.eq(num).siblings().css("left","100%");

			$slider.on("click", ".prev", function(){
				if ( !$sliderItems.eq(num).is(":animated") ){
					$sliderItems.eq(num).animate({ left: "100%" }, 500 ).siblings().css("left","-100%");
					num = num-1 < 0 ? $sliderItems.length-1 : num-1;//인덱스 넘버링
					slideMove();
				}
			});

			$slider.on("click", ".next", function(){
				if ( !$sliderItems.eq(num).is(":animated") ){
					$sliderItems.eq(num).animate({ left: "-100%" }, 500 ).siblings().css("left","100%");
					num = num+1 >= $sliderItems.length ? 0 : num+1;//인덱스 넘버링
					slideMove();
				}
			});

			function slideMove(){
				$sliderItems.eq(num).animate({ left: "0" }, 500 );
				$(".cover-slider .paging button").eq(num).addClass("current").siblings().removeClass("current");
				$(".post-item .article-info").removeClass("current");
				$(".post-item .article-info").eq(num).addClass("current");
			}

			$slider.on("touchstart", function(){
				var touch = event.touches[0];
				touchstartX = touch.clientX,
				touchstartY = touch.clientY;
			});

			$slider.on("touchend", function(){
				if( event.touches.length == 0 ){
					var touch = event.changedTouches[event.changedTouches.length - 1];
					touchendX = touch.clientX,
					touchendY = touch.clientY,
					touchoffsetX = touchendX - touchstartX,
					touchoffsetY = touchendY - touchstartY;

					if ( Math.abs(touchoffsetX) > 10 && Math.abs(touchoffsetY) <= 100 ){
						if (touchoffsetX < 0 ){
							$slider.find(".next").click();
						} else {
							$slider.find(".prev").click();
						}
					}
				}
			});
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

	//자동 슬라이딩 간격 설정
	if ( $("#content > .inner .post-item").length ){
		coverSlider();
		var interval = parseInt($('body').attr('interval'));
		if(interval == undefined || interval < 0 || interval > 60){
			interval = 5;
		}
		if(interval > 0){
			setInterval(	
				function autoScrollSlider(){
					$( ".article-info.current .next" ).click();
				}, interval*1000);
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

	//날짜 포맷 10자리
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

	//모바일 카테고리 이동
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

	//이미지 로딩 콜백
	function loadImage(b_more){
		$("body").append('<div id="loading_spinner"><i class="fas fa-spinner fa-pulse"></i></div>');
		$.waitForImages.hasImgProperties = ['backgroundImage'];
		$('#content > .inner > .post-item').waitForImages(true).done(function() {      
			$("#loading_spinner").remove();
		});
		//에러이미지 로딩
		if(!$('#content > .inner div').length){
			var script = document.currentScript;
			var url = (script.src).replace('script.js','');
			$('#content > .inner').prepend('<div class="post-item" style="background-image:url('+url+'error.jpg);"><div class="article-info"><div class="inner"><a href="/"><span class="title">표시할 내용이 없습니다.</span><div class="btn view">홈으로</div></a></div></div></div>');
			$('.post-item .article-info').css('opacity','1');
		}else{
			$(".post-item .article-info").eq(0).addClass("current");//첫째 슬라이드 액티브 속성 부여
		}
		//스크롤바 필요한 페이지 처리
		if(!$('#content > .inner > .post-item').length){
			$('#content').css('overflow','auto');
			$('#content > .inner').css('height','auto');
			$('#content > .inner').css('max-width','960px');
			$('#content > .inner').css('margin','90px auto 150px');
		}
	}

	//하단 언폴딩 메뉴 펼침
	$('.btn-unfold').click(function(){
		if($('#footer.activ').length){
			$('#header').removeClass('activ');
			$('#footer').removeClass('activ');
			$('.pagination').removeClass('activ');
			$('.social-link').removeClass('activ');
			$('.article-info.currenthide').removeClass('currenthide').addClass('current');
		}else{
			$('#header').addClass('activ');
			$('#footer').addClass('activ');
			$('.pagination').addClass('activ');
			$('.social-link').addClass('activ');
			$('.article-info.current').removeClass('current').addClass('currenthide');
		}
		return false;
	});

	loadImage(false);

})(jQuery);
