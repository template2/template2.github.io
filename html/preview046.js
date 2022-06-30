(function($) {

	if(!$('.cover-slider').length){
		var $pathname = window.location.pathname;
		if($pathname != "/"){
			location.href = '/';
			//$('#wrap').show();
		}else{
			$('.container').remove();
			$('#wrap').prepend('<div class="noinit"><div>준비중입니다...</div></div>')
			$('#wrap').show();
		}
	}else{
		$('#wrap').show();
	}

	var $is_mobile = false;//모바일 기기 체크
	checkMobile()
	setMobileCategory(); //모바일 메뉴로 카테고리 붙였다 뗌
	setNoImage();	

	var b_view_kakaomap = $('body.kakaomap').length ? true:false;
	var search_address = $('body').attr('search-address');
	var display_address = $('body').attr('display-address');
	if(display_address == ""){
		display_address = search_address ;
	}

	function coverSlider(){
		$(".cover-slider").each(function(){
			
			var $this = $(this), //현재 슬라이드 이너 객체
				$sliderItems = $(this).find("li"), //슬라이드 아이템들 객체 리스트
				$itemsLength = $sliderItems.length, //슬라이드 아이템 갯수
				$num = 0, //슬라이드 인덱스
				$looper = null; //슬라이드 인터벌 타이머 객체
				$interval = 5000;// 슬라이드 이동 간격, 0이면 멈춤
				$animateTime = 500; //슬라이드 이동시간
				$timeouts = [];
			
			if ( $itemsLength > 1 ){
				//add prev, next button
				$this.append('<button type="button" class="prev"><span>이전</span></button><button type="button" class="next"><span>다음</span></button>');
				$looper = setLoop();
					
				//add indicator
				$this.append('<ol class="cover-slider-indicator"></ol>');
				for(let i=0;i<$itemsLength;i++){
					var $element = $('<li index="'+i+'" class="'+(i==0?'active':'')+'"></li>');
					$element.click(function(){
						
						var $clicked_indicator = parseInt($(this).attr('index'));
						if($num != $clicked_indicator){
							var sliding_size = Math.abs($num - $clicked_indicator);
							clearInterval($looper);
							
							for(let j = 0;j<sliding_size;j++){
								(function(direction, index){
									$timeouts.push(setTimeout(function(){
										moveCascadeSlides(direction, index);
										},$animateTime*index));
									}
								)(($num < $clicked_indicator ? 1:-1), j);
							}
							$looper = setLoop();
						}
					});
					$this.find('.cover-slider-indicator').append($element);
				}
				//add css property to slider
				$sliderItems.css({
					"position": "absolute",
					"top": 0,
				});
				$sliderItems.eq($num).siblings().css("left","100%");
	
				//add prev click event
				$this.on("click", ".prev", function(){
					if ( !$sliderItems.eq($num).is(":animated") ){
						$sliderItems.eq($num).animate({ left: "100%" }, $animateTime ).siblings().css("left","-100%");
						$num = $num-1 < 0 ? $sliderItems.length-1 : $num-1;
						moveSlide();
						$($this).find('ol li').removeClass('active');
						$($this).find('ol li').eq($num).addClass('active');
					}
				});
				
				//add next click event
				$this.on("click", ".next", function(){
					if ( !$sliderItems.eq($num).is(":animated") ){
						$sliderItems.eq($num).animate({ left: "-100%" }, $animateTime ).siblings().css("left","100%");
						$num = $num+1 >= $sliderItems.length ? 0 : $num+1;
						moveSlide();
						$($this).find('ol li').removeClass('active');
						$($this).find('ol li').eq($num).addClass('active');
					}
				});
				
				//slide rotate init
				function setLoop(){
					if($interval > 0){
						return setInterval(
							function autoScrollSlider(){
								$($this).find('.next').trigger( "click" );
							}, $interval
						);
					}
				}
	
				//animate indicator click
				function moveCascadeSlides(direction, idx){
					var next_num = $num + direction;
					$sliderItems.eq($num).animate({ left: (-100*direction)+"%" }, $animateTime ).siblings().css("left",(100*direction)+"%");
					$sliderItems.eq(next_num).animate({ left: "0" }, $animateTime );
					$($this).find('ol li').removeClass('active');
					$($this).find('ol li').eq(next_num).addClass('active');
					$num = next_num;
					clearTimeout($timeouts[idx]);
				}
				
				//animate 1 slide item
				function moveSlide(){
					$sliderItems.eq($num).animate({ left: "0" }, $animateTime );
					$(".cover-slider .paging button").eq($num).addClass("current").siblings().removeClass("current");
				}
	
				//add mobile touch
				$this.on("touchstart", function(){
					var touch = event.touches[0];
					touchstartX = touch.clientX,
					touchstartY = touch.clientY;
				});
	
				//add mobile touch end
				$this.on("touchend", function(){
					if( event.touches.length == 0 ){
						var touch = event.changedTouches[event.changedTouches.length - 1];
						touchendX = touch.clientX,
						touchendY = touch.clientY,
						touchoffsetX = touchendX - touchstartX,
						touchoffsetY = touchendY - touchstartY;
	
						if ( Math.abs(touchoffsetX) > 10 && Math.abs(touchoffsetY) <= 100 ){
							if (touchoffsetX < 0 ){
								$this.find(".next").click();
							} else {
								$this.find(".prev").click();
							}
						}
					}
				});
			}//itemsLength > 1
		});
	}	

	function setNoImage(){
		$(".post-item .thum, .cover-thumbnail-list .thum, .cover-gallery figure").each(function(){
			if(!$(this).find('img').length){
				$(this).append('<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAQAAAAe/WZNAAAADklEQVR42mNkgAJGDAYAAFEABCaLYqoAAAAASUVORK5CYII=">');
				$(this).addClass('noimage');
			}
		})	
	}

	//모바일기기체크 - @media로 체크
	function checkMobile(){
		if( $('.mobile-menu').css('display')=='block') {
			$is_mobile = true;
		}else{
			$is_mobile = false;
		}
	}

	function setMobileCategory(){
		if($('#header .category-menu').css('display') == 'none'){
			if($('.category-menu > .inner > .category').length){
				$('#gnb').prepend($('<div id="mobile_category" class="box_aside"></div>'));
				$('.category-menu > .inner > .category').detach().appendTo('#mobile_category');
				$('#mobile_category ul li a').on('click',clickMobileMenu);
			}else{
				$('#header .category').css('display','block');
			}
		}else{
			if($('#gnb > #mobile_category').length){
				$('#mobile_category .category').detach().prependTo('.category-menu > .inner');
				$('#mobile_category').remove();
				$('#mobile_category ul li a').off('click');
			}
		}
	}//setmobilecategory
	
	function clickMobileMenu(){
		if($('.mobile-menu').css('display') == 'block'){
			$('.mobile-menu').trigger('click');
		}
	}

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
			if ( $(".menu.on").length ){
				if ( $("#dimmed").length ){
					$("#dimmed").remove();
				}
				if ( $(".mobile-menu").hasClass("on") ){
					$(".mobile-menu").click();
				}
			}
			checkMobile();
			if(!$is_mobile){
				$('#content').css('width',parseInt($('.container').css('width'))-320);
			}else{
				$('#content').css('width','');
			}

			setMobileCategory();
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
	}//gnb

	if(b_view_kakaomap){
		var address = search_address;
		var y = 0, x = 0;
		$map_obj = $('#cover-kakaomap .inner');

		if($map_obj.length && address != ""){
			//카카오맵

			//위도 경도 얻기
			var geocoder = new daum.maps.services.Geocoder();
			// 주소로 좌표를 검색
			geocoder.addressSearch(address, function(result, status) {
				
				// 정상적으로 검색이 완료됐으면,
				if (status == daum.maps.services.Status.OK) {
					
					var coords = new daum.maps.LatLng(result[0].y, result[0].x);
					y = result[0].x;//경도
					x = result[0].y;//위도

					$($map_obj).append('<div id="kakaomap" class="item"><div id="kakaomap-inner"></div></div>');
					var mapContainer = document.getElementById('kakaomap-inner');
	
					var mapOption = { //지도를 생성할 때 필요한 기본 옵션
						center: new daum.maps.LatLng(x, y), //지도의 중심좌표.
						level: 4 //지도의 레벨(확대, 축소 정도)
					};
					var map = new daum.maps.Map(mapContainer, mapOption); // 지도를 생성합니다
	
					// 마커가 표시될 위치입니다 
					var markerPosition  = new daum.maps.LatLng(x, y); 
	
					// 마커를 생성합니다
					var marker = new daum.maps.Marker({
						position: markerPosition
					});
	
					// 마커가 지도 위에 표시되도록 설정합니다
					marker.setMap(map);
	
					var iwContent = '<div style="padding:7px;letter-spacing:0px;color:#000;text-align:left;">'+display_address+'&nbsp;&nbsp;</div>', // 인포윈도우에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다
						iwPosition = new daum.maps.LatLng(x, y); //인포윈도우 표시 위치입니다
	
					// 인포윈도우를 생성합니다
					var infowindow = new daum.maps.InfoWindow({
						position : iwPosition, 
						content : iwContent 
					});
						
					// 마커 위에 인포윈도우를 표시합니다. 두번째 파라미터인 marker를 넣어주지 않으면 지도 위에 표시됩니다
					infowindow.open(map, marker);
	
					// 일반 지도와 스카이뷰로 지도 타입을 전환할 수 있는 지도타입 컨트롤을 생성합니다
					var mapTypeControl = new daum.maps.MapTypeControl();
	
					// 지도에 컨트롤을 추가해야 지도위에 표시됩니다
					// daum.maps.ControlPosition은 컨트롤이 표시될 위치를 정의하는데 TOPRIGHT는 오른쪽 위를 의미합니다
					map.addControl(mapTypeControl, daum.maps.ControlPosition.TOPRIGHT);
	
					// 지도 확대 축소를 제어할 수 있는  줌 컨트롤을 생성합니다
					var zoomControl = new daum.maps.ZoomControl();
					map.addControl(zoomControl, daum.maps.ControlPosition.RIGHT);						
				}

			});//address Search

		}				
	}

	gnb();

	$('.btn-top').click(function(){
		$("html, body").animate({ scrollTop: 0 }, 600);
		return false;
	});

	if ( $(".cover-slider").length ){
		coverSlider();
		$('.cover-slider').detach().appendTo('#header');
	}
	if( $(".cover-thumbnail-list, .cover-gallery").length ){
		$(".cover-thumbnail-list, .cover-gallery").each(function(){
				var len = $(this).find('ul li').length;
				$(this).addClass('type'+(len>4?parseInt(len/2):len));
		});
	}

	$('a.text-box').each(function(){
		if($(this).attr('href') == ""){
			$(this).remove();
		}
	});

})(jQuery);
