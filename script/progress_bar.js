

///// Progress Bar /////
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
  console.log(scrollValue);

  if(scrollValue > 11){
    whatsappOpenner.style.display = "grid";
  } else {
    whatsappOpenner.style.display = "none";
  }

  progressBarIndicator.style.width = scrollValue + "%";
});
