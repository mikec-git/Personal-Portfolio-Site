// function parallaxScene(element, option, variables) {

// }

window.addEventListener('scroll', individualParallaxSetup, false);        
window.addEventListener('mousewheel', individualParallaxSetup, false);        
window.addEventListener('DOMMouseScroll', individualParallaxSetup, false);

let cornerLogo = document.querySelector('.logo-box'),
    aboutTitle = document.querySelector('.section-title--about');

let documentHeight = document.body.clientHeight;
let scroll = {};
let viewport = {}

function individualParallaxSetup() {
    scroll.y = window.pageYOffset;
    viewport.y = document.documentElement.clientHeight;

    if(scroll.y/documentHeight > 0.1) {
        TweenMax.to(cornerLogo, 0.5, {
            autoAlpha: 1,
            ease: Power3.easeOut
        });
    } else {
        TweenMax.to(cornerLogo, 0.5, {
            autoAlpha: 0,
            ease: Power3.easeOut
        });
    }
    
    let elementCenter = aboutTitle.getBoundingClientRect().top + aboutTitle.clientHeight/2;
    let distFromCenter = Math.round(elementCenter - viewport.y/2);
    // console.log(distFromCenter);
    // console.log(Math.abs(distFromCenter));
    // if(section)
    // if(distFromCenter <= 0 && distFromCenter > -5 && Math.abs(distFromCenter) < 300) {
    //     aboutTitle.style.position = 'fixed';
    //     aboutTitle.style.top = '50%';
    //     aboutTitle.style.left = '50%';
    //     aboutTitle.style.transform = 'translate(-50%, -50%)';
    // } else {
    //     aboutTitle.style.position = 'relative';
    // }
}