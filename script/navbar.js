// NAV BAR
const nav = document.querySelector("#nav");
const progressBar = document.querySelector("#progress-bar");


const onScroll = (event) => {
  const scrollPosition = event.target.scrollingElement.scrollTop;
  if (scrollPosition > 10) {
    if (!nav.classList.contains("scrolled-down"))
      nav.classList.add("scrolled-down");
      progressBar.classList.add("progress-bar-heightd");
  } else {
    if (nav.classList.contains("scrolled-down"))
      nav.classList.remove("scrolled-down");
      progressBar.classList.remove("progress-bar-heightd");

  }
};

document.addEventListener("scroll", onScroll);
window.addEventListener("scroll", onScroll);

// FAQ accordion
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

//   const scrollPos = window.scrollY;
//   const navHeight = nav.offsetHeight;

//   if (scrollPos > navHeight) {
//     nav.classList.add("fixed");
//   } else {
//     nav.classList.remove("fixed");
//   }

// const onScroll = (event) => {
//   const scrollPosition = event.target.scrollingElement.scrollTop;
//   if (scrollPosition > 10) {
//     if (!nav.classList.contains("scrolled-down")) {
//       nav.classList.add("scrolled-down");
//     }
//   } else {
//     if (nav.classList.contains("scrolled-down")) {
//       nav.classList.remove("scrolled-down");
//     }
//   }
// };
