// window.addEventListener("DOMContentLoaded", scrollLoop, false);
// let moon = document.querySelector(".purple-sky--moon");
// let columnTextMain = document.querySelector(".column-text--main");
// let columnTextSecondary = document.querySelectorAll(".column-text--secondary");


// let xScrollPos;
// let yScrollPos;

// function scrollLoop(e) {
//     xScrollPos = window.scrollX;
//     yScrollPos = window.scrollY;

//     setTranslate(0, yScrollPos * -0.2, moon);
//     setTranslate(0, yScrollPos * -0.15, columnTextMain);

//     columnTextSecondary.forEach(text => {
//         setTranslate(0, yScrollPos * -0.15, text);
//     })

//     requestAnimationFrame(scrollLoop);
// }

// function setTranslate(xPos, yPos, el) {
//     el.style.transform = "translate3d(" + xPos + ", " + yPos + "px, 0)";
// }