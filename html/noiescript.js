/* -----------------------------------------
	119 Responsive Metro Ver 1.0
	2021.11.29
	https://blogpack.tistory.com
	email: extflash@gmail.com
	Distributed under MIT License
----------------------------------------- */

window.addEventListener('DOMContentLoaded', function(){
	window.lazyLoad = lazyLoad;//전역으로 등록
	if(document.querySelector('html.seo-lazyload') != null && document.querySelector('html.ie11') == null){
		const imgs = document.querySelectorAll('article img');
		lazyLoad(imgs, document.querySelector('html.square-thumbnail') != null ? true:false);
	}    
});

/* 이미지 레이지로드 처리 */
function lazyLoad(imgs, isSquareThumbnail){
	if(imgs.length > 0){
		/* 페이지 안의 이미지 "src" 속성을 "data-src" 속성으로 옮기고 "lazyload" 클래스 부여 */
		imgs.forEach(function(img){
			const rect = img.getBoundingClientRect();
			if(!(rect.bottom > window.pageYOffset && rect.top < window.pageYOffset+(window.innerHeight || document.documentElement.clientHeight))){
				if(img.getAttribute('srcset') != null){
					img.setAttribute('data-srcset', img.getAttribute('srcset'));
					if(isSquareThumbnail){
						img.setAttribute('srcset', 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==');
					}else{
						img.setAttribute('srcset', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAACCAQAAAA3fa6RAAAADklEQVR42mNkAANGCAUAACMAA2w/AMgAAAAASUVORK5CYII=');
					}
				}
				if(img.getAttribute('src') != null){
					img.setAttribute('data-src', img.getAttribute('src'));
					if(isSquareThumbnail){
						img.setAttribute('src', 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==');
					}else{
						img.setAttribute('src', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAACCAQAAAA3fa6RAAAADklEQVR42mNkAANGCAUAACMAA2w/AMgAAAAASUVORK5CYII=');
					}
				}
				img.classList.add('lazyload');			
			};
		});
	}

	//"src"를 처리함 이미지 태그에 프로미스 비동기 함수를 매핑
	[...document.querySelectorAll('#content img.lazyload')].forEach(async img => {
		await onElementVisible(img);
		if(img.getAttribute('src') != null){
			img.setAttribute('src', img.getAttribute('data-src'));
		}
		if(img.getAttribute('srcset') != null){
			img.setAttribute('srcset', img.getAttribute('data-srcset'));
		}
	});
}

/* 이미지가 뷰포트 안이면 비동기로 이미지 로딩 */
function onElementVisible(element, options = {}){
	// 기본 교차 옵저버 옵션 설정
	const intersectionObserverOptions = {
		rootMargin: '0px',
		threshold: 0,
		...options,
	};

	//이미지가 처음 화면 도큐먼트 뷰포트 영역 안에 표시되면 리졸브 콜백을 실행하는 프로미스 객체를 리턴
	return new Promise(resolve => {
		//옵저버 객체 생성
		const observer = new IntersectionObserver(async entries => {
			// 뷰포트와 교차한 목록
			const [entry] = entries;

			// 도큐먼트 루트와 교차했는지 체크
			if (entry.isIntersecting) {
				// 프로미스 리졸브 실행
				resolve();
				// 옵저버를 종료해 한번만 실행되도록 함
				observer.disconnect();
			}
		}, intersectionObserverOptions);
		observer.observe(element);
	});
}