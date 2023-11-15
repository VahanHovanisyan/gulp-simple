// scroll: lock / unlock
import { page } from "../page.js";

export const pageBody = document.body;

const scrollController = {
	pagePosition: window.scrollY,
	fixBlocks: document?.querySelectorAll('.fixed-block'),
	paddingOffset: `${(window.innerWidth - pageBody.offsetWidth)}px`,

	lockScroll: function() {
		page.style.scrollBehavior = 'none';
		this.fixBlocks.forEach(el => { el.style.paddingRight = this.paddingOffset; });
		pageBody.style.paddingRight = this.paddingOffset;
		pageBody.classList.add('lock-scroll');
		pageBody.dataset.position = this.pagePosition;
		pageBody.style.top = `-${this.pagePosition}px`;
	},

	unLockScroll: function() {
		this.fixBlocks.forEach(el => { el.style.paddingRight = '0px'; });
		pageBody.style.paddingRight = '0px';
		pageBody.style.top = 'auto';

		pageBody.classList.remove('lock-scroll');
		window.scroll({
			top: this.pagePosition,
			left: 0
		});
		pageBody.removeAttribute('data-position');
		page.style.scrollBehavior = 'smooth';
	}
}