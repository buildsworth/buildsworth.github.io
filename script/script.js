// ========================================
//  how to add media queries in JS
// ========================================
function testimonialsSwiperFunction(widthSize) {
  if (widthSize.matches) {
    // If media query matches
    const swiper = new Swiper(".testimonials-swipper", {
      slidesPerView: 1,
      spaceBetween: 30,
      autoplay: {
        delay: 4500,
        disableOnInteraction: false,
      },

      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
    });
  } else {
    const swiper = new Swiper(".testimonials-swipper", {
      slidesPerView: 2,
      spaceBetween: 30,
      autoplay: {
        delay: 4500,
        disableOnInteraction: false,
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
    });
  }
}

const servicesSwiper = new Swiper('.carousel', {
  slidesPerView: 1,
  spaceBetween: 30,
  autoplay: {
    delay: 5000,
    disableOnInteraction: false,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev'
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  }
})

const widthSize = window.matchMedia("(max-width: 780px)");
// Call listener function at run time
testimonialsSwiperFunction(widthSize);
// Attach listener function on state changes
widthSize.addListener(testimonialsSwiperFunction);



// ------------ Clients Counter -------------

$.fn.jQuerySimpleCounter = function( options ) {
  var settings = $.extend({
      start:  0,
      end:    100,
      easing: 'swing',
      duration: 400,
      complete: ''
  }, options );

  var thisElement = $(this);

  $({count: settings.start}).animate({count: settings.end}, {
  duration: settings.duration,
  easing: settings.easing,
  step: function() {
    var mathCount = Math.ceil(this.count);
    thisElement.text(mathCount);
  },
  complete: settings.complete
});
};


$('#number1').jQuerySimpleCounter({end: 18,duration: 3000});
$('#number2').jQuerySimpleCounter({end: 22,duration: 3000});
$('#number3').jQuerySimpleCounter({end: 8,duration: 2000});
$('#number4').jQuerySimpleCounter({end: 6,duration: 2500});



/* AUTHOR LINK */
 $('.about-me-img').hover(function(){
        $('.authorWindowWrapper').stop().fadeIn('fast').find('p').addClass('trans');
    }, function(){
        $('.authorWindowWrapper').stop().fadeOut('fast').find('p').removeClass('trans');
    });


//------------ FAQ Accordions ------------
const faq = document.querySelector('.faq')
faq.addEventListener('click', event => {
	const question = event.target.closest('.faq__question')
	if (!question) return
	const answer = question.nextElementSibling
	// hide previously opened answer and show the clicked answer
	const currentAnswer = faq.querySelector('.faq__answer[aria-hidden="false"]')
	if (currentAnswer === answer) {
		// close the already open answer
		answer.setAttribute('aria-hidden', 'true')
		answer.parentNode.classList.remove('faq__item--expanded')
		question.setAttribute('aria-expanded', 'false')
	} else {
		// hide previously open answer and show the clicked answer
		if (currentAnswer) {
			currentAnswer.setAttribute('aria-hidden', 'true')
			currentAnswer.parentNode.classList.remove('faq__item--expanded')
			currentAnswer.previousElementSibling.setAttribute(
				'aria-expanded',
				'false'
			)
		}
		answer.setAttribute('aria-hidden', 'false')
		answer.parentNode.classList.add('faq__item--expanded')
		question.setAttribute('aria-expanded', 'true')
	}
})