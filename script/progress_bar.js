

///// Progress Bar /////
const progressBarIndicator = document.querySelector("#progress");

document.addEventListener("scroll", () => {
  let pos = document.documentElement.scrollTop;
//   console.log(pos);
  let calcHeight =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;
  // console.log(calcHeight);
  let scrollValue = Math.round((pos * 100) / calcHeight);
  console.log(scrollValue);

  progressBarIndicator.style.width = scrollValue + "%";
});
