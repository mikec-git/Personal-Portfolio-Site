import { regex } from './parallax-config';

// ABOUT SECTION
const aboutParallax = (function() {
    let sectionAbout    = document.querySelector('.section-about'),
        aboutMain       = document.querySelector('.about'),
        aboutTitle      = document.querySelector('.about__title'),
        noiseContainer  = document.querySelector('.noise-body'),
        noiseCanvas     = document.querySelector('.noise'),
        body            = document.querySelector('.body');

    let aboutScenes = [];

    let aboutPaddingBottom = regex.exec(window.getComputedStyle(sectionAbout).padding)[0];
    let sectionAboutEnd    = aboutMain.clientHeight + Number(aboutPaddingBottom);
    
    
    let aboutTitleFadeIn    = new TweenMax.from(aboutTitle, 0.000001, { autoAlpha: 0 });
    let aboutTitleFadeOut   = new TweenMax.to(aboutTitle, 0.000001, { autoAlpha: 0 }); 
    let aboutSceneEnd       = new TimelineMax();
        aboutSceneEnd.to(noiseCanvas, 1, { autoAlpha: 0, ease: Quad.easeOut})
        .to(body, 1, { backgroundColor: 'white', ease: Quad.easeOut }, 0);  

    aboutScenes.push(
        new ScrollMagic.Scene({
            triggerElement: ".about__title",
            offset: aboutTitle.clientHeight/2,
            reverse: true
        })
        .setTween(aboutTitleFadeIn)
        .triggerHook(0.5)
        .addIndicators({ name: 'aboutTitlePinIn', indent: 200 }),

        new ScrollMagic.Scene({
            triggerElement: ".about__title",
            offset: sectionAboutEnd + aboutTitle.clientHeight/2,
            reverse: true })
            .setTween(aboutTitleFadeOut)
            .triggerHook(0.5)
            .addIndicators({ name: 'aboutTitleFadeOut', indent: 700 }),
        
        new ScrollMagic.Scene({
            triggerElement: ".about__title",
            offset: sectionAboutEnd + aboutTitle.clientHeight/2,
            reverse: true })
            .setTween(aboutSceneEnd)
            .triggerHook(0.5)
            .addIndicators({ name: 'aboutTitlePinOut', indent: 200, colorStart: 'red' }),

        new ScrollMagic.Scene({
            triggerElement: ".about__title", 
            duration: sectionAboutEnd,
            offset: aboutTitle.clientHeight/2,
            reverse: true })
            .triggerHook(0.5)
            .setPin(".about__title", {pushFollowers: false})
            .addIndicators({ name: 'aboutTitlePin' })
    );

    return aboutScenes;
})();

export { aboutParallax };