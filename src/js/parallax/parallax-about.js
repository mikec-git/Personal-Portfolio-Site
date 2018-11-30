import { regex } from './parallax-config';

// ABOUT SECTION
const aboutParallax = (function() {
    let sectionAbout    = document.querySelector('.section-about'),
        aboutMain       = document.querySelector('.about'),
        aboutTitle      = document.querySelector('.about__title'),
        noiseContainer  = document.querySelector('.noise-body');

    let aboutScenes = [];

    let aboutPaddingBottom = regex.exec(window.getComputedStyle(sectionAbout).paddingBottom) || regex.exec                                    (window.getComputedStyle(sectionAbout).padding)[0];
    let sectionAboutEnd    = aboutMain.clientHeight + Number(aboutPaddingBottom);    
    
    let aboutTitleFadeIn    = new TweenMax.from(aboutTitle, 0.000001, { autoAlpha: 0 });
    let aboutTitleFadeOut   = new TweenMax.to(aboutTitle, 0.000001, { autoAlpha: 0 }); 
    let aboutSceneStart     = new TweenMax.to(noiseContainer, 0.4,{ backgroundColor: '#888', ease: Quad.easeIn });
    // let aboutSceneEnd       = new TweenMax.to(noiseContainer, 0.4,{ backgroundColor: '#111', ease: Quad.easeIn });

    aboutScenes.push(
        // =============================================================== //
        //                          ABOUT TITLE                            //
        // =============================================================== //

        // PIN ABOUT TITLE
        new ScrollMagic.Scene({
            triggerElement: ".about__title", 
            duration: sectionAboutEnd,
            offset: aboutTitle.clientHeight/2,
            reverse: true })
            .triggerHook(0.5)
            .setPin(".about__title", {pushFollowers: false})
            .addIndicators({ name: 'titlePin' }),

        // FADE IN ABOUT TITLE
        new ScrollMagic.Scene({
            triggerElement: ".about__title",
            offset: aboutTitle.clientHeight/2,
            reverse: true })
            .setTween(aboutTitleFadeIn)
            .triggerHook(0.5)
            .addIndicators({ name: 'titleFadeIn', indent: 200 }),
            
        // FADE OUT ABOUT TITLE
        new ScrollMagic.Scene({
            triggerElement: ".about__title",
            offset: sectionAboutEnd + aboutTitle.clientHeight/2,
            reverse: true })
            .setTween(aboutTitleFadeOut)
            .triggerHook(0.5)
            .addIndicators({ name: 'titleFadeOut', indent: 700 }),

        // =============================================================== //
        //                        BACKGROUND COLOR                         //
        // =============================================================== //

        // FADE BACKGROUND TO NEW COLOR (IN)
        new ScrollMagic.Scene({
            triggerElement: ".about__title",
            offset: aboutTitle.clientHeight/2,
            duration: sectionAboutEnd - aboutTitle.clientHeight/2,
            reverse: true })
            .setTween(aboutSceneStart)
            .triggerHook(0.5)
            .addIndicators({ name: 'aboutBackgroundIn', indent: 200, colorStart: 'red' }),
        
        // FADE BACKGROUND TO NEW COLOR (OUT)
        // new ScrollMagic.Scene({
        //     triggerElement: ".about__title",
        //     offset: sectionAboutEnd + aboutTitle.clientHeight/2,
        //     reverse: true })
        //     .setTween(aboutSceneEnd)
        //     .triggerHook(0.5)
        //     .addIndicators({ name: 'aboutBackgroundOut', indent: 200, colorStart: 'red' })
    );

    return aboutScenes;
})();

export { aboutParallax };