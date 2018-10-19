// window.addEventListener('scroll', individualParallaxSetup, false);        
// window.addEventListener('mousewheel', individualParallaxSetup, false);        
// window.addEventListener('DOMMouseScroll', individualParallaxSetup, false);

let smController    = new ScrollMagic.Controller(),
    cornerLogo      = document.querySelector('.logo-box'),
    aboutTitle      = document.querySelector('.about__title'),
    header          = document.querySelector('.header');

let documentHeight  = document.body.clientHeight,
    viewport        = {x: document.documentElement.clientWidth, y: document.documentElement.clientHeight};


let sectionProjectsMid =  document.querySelector('.about').clientHeight + aboutTitle.clientHeight;


let aboutTitleIntro = new ScrollMagic.Scene({
    triggerElement: ".about__title", 
    duration: sectionProjectsMid,
    reverse: true
    })
    .triggerHook(0.5)
    .offset(aboutTitle.clientHeight/2)
    .setPin(".about__title", {pushFollowers: false})
    .addIndicators({ name: 'triggerStart' })
    .addTo(smController);

let cornerLogoTween = TweenMax.to(cornerLogo, 0.5, {
    autoAlpha: 1,
    ease: Power3.easeOut
});

let cornerLogoToggle = new ScrollMagic.Scene({
    triggerElement: ".header",
    offset: header.clientHeight/2,
    reverse: true
    })
    .setTween(cornerLogoTween)
    .addTo(smController);