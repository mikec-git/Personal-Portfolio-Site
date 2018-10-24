import { regex, viewport } from './parallax-config';
import { start } from '../carousel';

// PROJECTS SECTION
const projectsParallax = (function() {
    let projectsScenes = [];

    const sectionProjects = document.querySelector('.section-projects'),
          projectsMain    = document.querySelector('.projects'),
          projectsTitle   = document.querySelector('.projects__title'),
          projectsTitle2  = document.querySelector('.projects__title--2'),
          carousel        = document.querySelector('.carousel'),
          marginBottomLg  = document.querySelector('.u-mb-large'),          
          noiseContainer  = document.querySelector('.noise-body'),
          canvasImage     = document.querySelector('.carousel-item__img'),
          cta             = document.querySelector('.carousel__cta');

    let sectionProjectsStyle    = window.getComputedStyle(sectionProjects),
        marginBottomLgStyle     = window.getComputedStyle(marginBottomLg),
        carouselStyle           = window.getComputedStyle(carousel),
        projectsMainHeight      = projectsMain.clientHeight,
        projectsTitleHeight     = projectsTitle.clientHeight,
        carouselHeight          = carousel.clientHeight;

    let projectsSectionPaddingTop 
    = sectionProjectsStyle.paddingTop.match(regex) || sectionProjectsStyle.padding.match(regex)[0];
    let sectionProjectsEnd      
    =  projectsMainHeight + Number(projectsSectionPaddingTop);
    let carouselFromPaddingTop  
    = projectsTitleHeight + Number(marginBottomLgStyle.marginBottom.match(regex));
    let carouselMid 
    = carouselFromPaddingTop + carouselHeight/2;
    
    let projectsTitleFadeIn1     = new TweenMax.from(projectsTitle, 0.000001, { autoAlpha: 0 });
    let projectsTitleFadeOut1    = new TweenMax.to(projectsTitle, 0.000001, { autoAlpha: 0 });
    let backgroundColorSlideChange = new TweenMax.to(noiseContainer, 0.5, { backgroundColor: '#AEEEEE' });
    let projectsTitleFadeIn2    = new TweenMax.from(projectsTitle2, 0.000001, { autoAlpha: 0 });    
    let projectsTitleFadeOut2   = new TweenMax.to(projectsTitle2, 0.000001, { autoAlpha: 0 });
    let projectsTitleY2         = new TweenMax.from(projectsTitle2, 0.000001, { top: carouselFromPaddingTop});

    projectsScenes.push(
        // TITLE FADE IN 1
        new ScrollMagic.Scene({
            triggerElement: ".projects__title",
            offset: projectsTitleHeight/2,
            reverse: true })
        .setTween(projectsTitleFadeIn1)
        .triggerHook(0.5)
        .addIndicators({ name: 'projectsTitleIn1', indent: 100 }),

        // TITLE FADE OUT 1
        new ScrollMagic.Scene({
            triggerElement: ".projects__title",
            // offset: carouselMid - projectsTitleHeight/6,
            // offset: carouselMid,
            offset: sectionProjectsEnd,
            reverse: true })
        .setTween(projectsTitleFadeOut1)
        .triggerHook(0.5)
        .addIndicators({ name: 'projectsTitleOut1', indent: 200, colorStart: 'red' }),
       
        // TITLE FADE IN 2
        // new ScrollMagic.Scene({
        //     triggerElement: ".projects",
        //     offset: carouselMid - projectsTitleHeight/6,
        //     reverse: true })
        // .setTween(projectsTitleFadeIn2)
        // .triggerHook(0.5)
        // .addIndicators({ name: 'projectsTitleIn2', indent: 100 }),

        // TITLE FADE OUT 2
        // new ScrollMagic.Scene({
        //     triggerElement: ".projects",
        //     offset: projectsMainHeight + projectsTitleHeight/2,
        //     reverse: true })
        // .setTween(projectsTitleFadeOut2)
        // .triggerHook(0.5)
        // .addIndicators({ name: 'projectsTitleOut2', indent: 200, colorStart: 'red' }),

        // TITLE2 Y
        // new ScrollMagic.Scene({
        //     triggerElement: ".projects__title", 
        //     offset: projectsTitleHeight/2,
        //     duration: carouselFromPaddingTop,
        //     reverse: true })
        // .triggerHook(0.5)
        // .setTween(projectsTitleY2)
        // .addIndicators({ name: 'projectsTitlePin', indent: 400}),

        // TITLE PIN
        new ScrollMagic.Scene({
            triggerElement: ".projects__title", 
            offset: projectsTitleHeight/2,
            // duration: carouselFromPaddingTop,
            // duration: carouselMid,
            duration: sectionProjectsEnd - projectsTitleHeight/2,
            reverse: true })
        .triggerHook(0.5)
        .setPin(".projects__title", {pushFollowers: false})
        .addIndicators({ name: 'projectsTitlePin', indent: 400}),
        
        // // SECOND PIN FOR TITLE
        // new ScrollMagic.Scene({
        //     triggerElement: ".projects",
        //     offset: carouselMid - projectsTitleHeight/6,
        //     duration: projectsMainHeight,
        //     reverse: true })
        // .setPin('.projects__title--2', {pushFollowers: false})
        // .addIndicators({ name: 'rePinTitle', colorStart: 'blue', indent: 400}),

        // BG COLOR CHANGE PER SLIDE
        new ScrollMagic.Scene({
            triggerElement: ".projects__title",
            // offset: carouselMid - carouselHeight/6,
            offset: carouselMid,
            reverse: true })
        .triggerHook(0.5)
        .setTween(backgroundColorSlideChange)
        .addIndicators({ name: 'bgColorChange', colorStart: 'green'}),

        // CAROUSEL PIN FOR DURATION OF HORIZONTAL SCROLLING
        new ScrollMagic.Scene({
            triggerElement: ".projects",
            // offset: carouselMid - projectsTitleHeight/6,
            offset: carouselMid,
            duration: projectsMainHeight - carouselMid,
            reverse: true })
        .setPin('.carousel', {pushFollowers: false})
        .addIndicators({ name: 'pinProjects', colorStart: 'blue'}),
        
        // CAROUSEL IMG SWAP 1
        new ScrollMagic.Scene({
            triggerElement: ".projects",
            offset: carouselMid,
            duration: canvasImage.clientWidth,
            reverse: true })
        .on('progress', e =>  {
            requestAnimationFrame(() => {
                start(e, 0);
            });
        })
        .addIndicators({ name: 'IMG 1', colorStart: 'orange'}),

        // CAROUSEL IMG SWAP 2
        new ScrollMagic.Scene({
            triggerElement: ".projects",
            offset: carouselMid + canvasImage.clientWidth,
            duration: canvasImage.clientWidth,
            reverse: true })
        .on('progress', e =>  {
            requestAnimationFrame(() => {
                start(e, 1);
            });
        })
        .addIndicators({ name: 'IMG 1', colorStart: 'orange'}),

        
    );

    return projectsScenes;
})();

export { projectsParallax };