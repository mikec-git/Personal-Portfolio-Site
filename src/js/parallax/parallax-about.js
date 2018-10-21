import { regex } from './parallax-config';

// ABOUT SECTION
const aboutParallax = (function() {
    let sectionAbout    = document.querySelector('.section-about'),
        aboutMain       = document.querySelector('.about'),
        aboutTitle      = document.querySelector('.about__title'),
        noiseContainer  = document.querySelector('.noise-body'),
        noiseCanvas     = document.querySelector('.noise');

    let aboutScenes = [];

    let aboutPaddingBottom = regex.exec(window.getComputedStyle(sectionAbout).padding)[0];
    let sectionAboutEnd    = aboutMain.clientHeight + Number(aboutPaddingBottom);    
    
    let aboutTitleFadeIn    = new TweenMax.from(aboutTitle, 0.000001, { autoAlpha: 0 });
    let aboutTitleFadeOut   = new TweenMax.to(aboutTitle, 0.000001, { autoAlpha: 0 }); 
    let aboutSceneEnd       = new TimelineMax();
        aboutSceneEnd.to(noiseCanvas, 0.5, { autoAlpha: 0, ease: Quad.easeOut}, 0)
                     .to(noiseContainer, 0.5, { backgroundColor: 'white', ease: Linear }, 0);  

    aboutScenes.push(
        // PIN ABOUT TITLE
        new ScrollMagic.Scene({
            triggerElement: ".about__title", 
            duration: sectionAboutEnd,
            offset: aboutTitle.clientHeight/2,
            reverse: true })
            .triggerHook(0.5)
            .setPin(".about__title", {pushFollowers: false})
            .addIndicators({ name: 'aboutTitlePin' }),

        // FADE IN ABOUT TITLE
        new ScrollMagic.Scene({
            triggerElement: ".about__title",
            offset: aboutTitle.clientHeight/2,
            reverse: true })
            .setTween(aboutTitleFadeIn)
            .triggerHook(0.5)
            .addIndicators({ name: 'aboutTitlePinIn', indent: 200 }),

        // FADE OUT ABOUT TITLE
        new ScrollMagic.Scene({
            triggerElement: ".about__title",
            offset: sectionAboutEnd + aboutTitle.clientHeight/2,
            reverse: true })
            .setTween(aboutTitleFadeOut)
            .triggerHook(0.5)
            .addIndicators({ name: 'aboutTitleFadeOut', indent: 700 }),
        
        // FADE BACKGROUND TO NEW COLOR
        new ScrollMagic.Scene({
            triggerElement: ".about__title",
            offset: sectionAboutEnd + aboutTitle.clientHeight/2,
            reverse: true })
            .setTween(aboutSceneEnd)
            .triggerHook(0.5)
            .addIndicators({ name: 'aboutTitlePinOut', indent: 200, colorStart: 'red' })
    );

    return aboutScenes;
})();

export { aboutParallax };