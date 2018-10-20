let smController    = new ScrollMagic.Controller(),
    cornerLogo      = document.querySelector('.logo-box'),
    header          = document.querySelector('.header'),
    aboutTitle      = document.querySelector('.about__title'),
    projectsTitle   = document.querySelector('.projects__title'),
    noiseContainer  = document.querySelector('.noise-body'),
    noiseCanvas     = document.querySelector('.noise');

let documentHeight  = document.body.clientHeight,
    viewport        = {x: document.documentElement.clientWidth, y: document.documentElement.clientHeight};

let regex           = /\d+/g;