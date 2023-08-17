// ========================================
//  how to add media queries in JS
// ========================================
function myFunction(widthSize) {
  if (widthSize.matches) {
    // If media query matches
    const swiper = new Swiper(".swiper", {
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
    const swiper = new Swiper(".swiper", {
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

const widthSize = window.matchMedia("(max-width: 780px)");
// Call listener function at run time
myFunction(widthSize);
// Attach listener function on state changes
widthSize.addListener(myFunction);
