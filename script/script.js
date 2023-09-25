// ========================================
//  how to add media queries in JS
// ========================================

/*===== Progress Bar =====*/ 
const progressBarIndicator = document.querySelector("#progress");
const whatsappOpenner = document.querySelector("#whatsapp_opener");

document.addEventListener("scroll", () => {
  let pos = document.documentElement.scrollTop;
//   console.log(pos);
  let calcHeight =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;
  // console.log(calcHeight);
  let scrollValue = Math.round((pos * 100) / calcHeight);
  // console.log(scrollValue);

  if(scrollValue > 11){
    whatsappOpenner.style.display = "grid";
  } else {
    whatsappOpenner.style.display = "none";
  }

  progressBarIndicator.style.width = scrollValue + "%";
});


/*===== TESTIMONIAL SWIPER =====*/ 
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

const servicesSwiper = new Swiper(".carousel", {
  slidesPerView: 1,
  spaceBetween: 30,
  autoplay: {
    delay: 5000,
    disableOnInteraction: false,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
});

const widthSize = window.matchMedia("(max-width: 780px)");
// Call listener function at run time
testimonialsSwiperFunction(widthSize);
// Attach listener function on state changes
widthSize.addListener(testimonialsSwiperFunction);

// ------------ Clients Counter -------------

// $.fn.jQuerySimpleCounter = function (options) {
//   var settings = $.extend(
//     {
//       start: 0,
//       end: 100,
//       easing: "swing",
//       duration: 400,
//       complete: "",
//     },
//     options
//   );

//   var thisElement = $(this);

//   $({ count: settings.start }).animate(
//     { count: settings.end },
//     {
//       duration: settings.duration,
//       easing: settings.easing,
//       step: function () {
//         var mathCount = Math.ceil(this.count);
//         thisElement.text(mathCount);
//       },
//       complete: settings.complete,
//     }
//   );
// };

// $("#number1").jQuerySimpleCounter({ end: 18, duration: 3000 });
// $("#number2").jQuerySimpleCounter({ end: 22, duration: 3000 });
// $("#number3").jQuerySimpleCounter({ end: 8, duration: 2000 });
// $("#number4").jQuerySimpleCounter({ end: 6, duration: 2500 });

// $(document).ready(function(){
//   $('.counter').counterUp({
//     delay: 10,
//     time: 1500
//   });
// });

// var waypoint = new Waypoint({
//   element: document.getElementById('.counter'),
//   handler: function() {
//     notify('Basic waypoint triggered')
//   }
// })

// const { counterUp } = window.counterUp;

// const el = document.querySelector( '.counter' )
// new Waypoint( {
//     element: el,
//     handler: function() {
//         counterUp( el )
//         this.destroy()
//     },
//     offset: 'bottom-in-view',
// } )

$(document).ready(function () {
  jQuery(function ($) {
    "use strict";

    var counterUp = window.counterUp["default"]; // import counterUp from "counterup2"

    var $counters = $(".counter");

    /* Start counting, do this on DOM ready or with Waypoints. */
    $counters.each(function (ignore, counter) {
      var waypoint = new Waypoint({
        element: $(this),
        handler: function () {
          counterUp(counter, {
            duration: 1200,
            delay: 16,
          });
          this.destroy();
        },
        offset: "bottom-in-view",
      });
    });
  });
});

// const el = document.querySelector( '.counter' )
// new Waypoint( {
//     element: el,
//     handler: function() {
//       // alert('You have scrolled to a thing')

//         counterUp( el )
//         this.destroy()
//     },
//     offset: 'bottom-in-view',
// } )

// const counterUp = window.counterUp.default

// const callback = entries => {
// 	entries.forEach( entry => {
// 		const el = entry.target
// 		if ( entry.isIntersecting && ! el.classList.contains( 'is-visible' ) ) {
// 			counterUp( el, {
// 				duration: 2000,
// 				delay: 16,
// 			} )
// 			el.classList.add( 'is-visible' )
// 		}
// 	} )
// }

// const IO = new IntersectionObserver( callback, { threshold: 1 } )

// const el = document.querySelector( '.counter' )
// IO.observe( el )
// scroll animation

/* TYPING ANIMATION */
var typed = new Typed("#typing-text", {
  strings: ["ARCHITECTURE", "LANDSCAPING", "STRUCTURE", "INTERIORS"],
  typeSpeed: 110,
  startDelay: 1000,
  fadeOut: true,
  fadeOutClass: "typed-fade-out",
  fadeOutDelay: 1400,
  showCursor: true,
  cursorChar: "|",
  shuffle: true,
  loop: true,
  loopCount: Infinity,
  // autoInsertCss: true,
});

/* AUTHOR LINK */
$(".about-me-img").hover(
  function () {
    $(".authorWindowWrapper").stop().fadeIn("fast").find("p").addClass("trans");
  },
  function () {
    $(".authorWindowWrapper")
      .stop()
      .fadeOut("fast")
      .find("p")
      .removeClass("trans");
  }
);

//------------ FAQ Accordions ------------
const faq = document.querySelector(".faq");
faq.addEventListener("click", (event) => {
  const question = event.target.closest(".faq__question");
  if (!question) return;
  const answer = question.nextElementSibling;
  // hide previously opened answer and show the clicked answer
  const currentAnswer = faq.querySelector('.faq__answer[aria-hidden="false"]');
  if (currentAnswer === answer) {
    // close the already open answer
    answer.setAttribute("aria-hidden", "true");
    answer.parentNode.classList.remove("faq__item--expanded");
    question.setAttribute("aria-expanded", "false");
  } else {
    // hide previously open answer and show the clicked answer
    if (currentAnswer) {
      currentAnswer.setAttribute("aria-hidden", "true");
      currentAnswer.parentNode.classList.remove("faq__item--expanded");
      currentAnswer.previousElementSibling.setAttribute(
        "aria-expanded",
        "false"
      );
    }
    answer.setAttribute("aria-hidden", "false");
    answer.parentNode.classList.add("faq__item--expanded");
    question.setAttribute("aria-expanded", "true");
  }
});


// let calcScrollValue = () => {

//   let scrollProgress = document.getElementById("progress");
//   let progressValue = document.getElementById("progress-value");
//   let pos = document.documentElement.scrollTop;
//   console.log(pos);
//   let calcHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
//   // console.log(calcHeight);
//   let scrollValue = Math.round((pos * 100) / calcHeight);
//   // console.log(scrollValue);//changing in scale of 100
//   if (pos > 100) {
//       scrollProgress.style.display = "grid";
//   } else {
//       scrollProgress.style.display = "none";

//   }
//   scrollProgress.addEventListener("click", () => {
//       document.documentElement.scrollTop = 0;
//   });
//   // scrollProgress.style.background = 'conic-gradient(#ff0000 '+scrollValue+'%, #ffffff '+scrollValue+'%)';
//   scrollProgress.style.background = `conic-gradient(#1CA4B0 ${scrollValue}%, #d7d7d7 ${scrollValue}%)`;
// };

// window.onscroll = calcScrollValue;
// window.onload = calcScrollValue;