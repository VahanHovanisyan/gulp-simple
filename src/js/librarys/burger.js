export class burger {
	constructor () {

	}
}

(function () {
	const burger = document.querySelector('[data-burger]');
	const nav = document.querySelector('[data-nav]');
	const navItems = document.querySelectorAll('[data-nav-item]');
	const header = document.querySelector(".header");
	const main = document.querySelector(".main");
	const headerContainer = document.querySelector(".header__container");

	const navShow = () => {
			burger?.classList.toggle('burger_active');
			setTimeout(() => {
					burger.focus();
			}, 300);
			nav?.classList.toggle('nav_active');
			header.classList.add("header_active");
			main.style.paddingTop = header.offsetHeight + "px";
			headerContainer.classList.add("header__container_active");
			nav.style.paddingTop = header.offsetHeight + "px";
			burger?.setAttribute('aria-expanded', 'true');
			burger?.setAttribute('aria-label', 'Close menu');
			disableScroll();
			document.addEventListener("keydown", (e) => {
					if (e.key == "Escape") {
							navHide();
					}
			})
	}

	const navHide = () => {
			burger.classList.remove('burger_active');
			nav?.classList.remove('nav_active');
			setTimeout(() => {
					header.classList.remove("header_active");
			}, 300);
			headerContainer.classList.remove("header__container_active");
			nav.style.paddingTop = "";
			burger?.setAttribute('aria-expanded', 'false');
			burger?.setAttribute('aria-label', 'Open menu'); enableScroll();
			setTimeout(() => {
					main.style.paddingTop = "";
			}, 300);
	}

	burger.addEventListener("click", function(event)  {
			if (event.target.closest(".burger")) {
					navShow();
			}
			if (!burger.classList.contains("burger_active")) {
					navHide();
			}
	});

	navItems?.forEach(el => {
			el.addEventListener('click', () => {
					navHide();
			});
	});

	const mediaQueryMinWidth_768 = window.matchMedia('(min-width: 768px)');
	mediaQueryMinWidth_768.addEventListener("change", (e) => {
			if (e.matches) {
					nav.style.paddingTop = "";
					main.style.paddingTop = "";
					header.classList.remove("header_active");
					headerContainer.classList.remove("header__container_active");
					enableScroll();
			} else {
					nav.style.paddingTop = header.offsetHeight + "px";
					if (burger.matches(".burger_active")) {
							disableScroll();
							header.classList.add("header_active");
							main.style.paddingTop = header.offsetHeight + "px";
					}
			}
			return false;
	});
})();