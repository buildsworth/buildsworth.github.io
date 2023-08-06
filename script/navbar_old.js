const headerEl = document.querySelector('.navbar');

const isScrolling = () => {
	const windowPosition = window.scrollY > 50
	headerEl.classList.toggle('navbar--active', windowPosition)
}

window.addEventListener('scroll', isScrolling)