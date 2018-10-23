import { regex } from './parallax-config';

// PROJECTS SECTION
const projectsParallax = (function() {
    let projectsScenes = [];

    const sectionProjects = document.querySelector('.section-projects'),
          projectsMain    = document.querySelector('.projects'),
          projectsTitle   = document.querySelector('.projects__title'),
          carousel        = document.querySelector('.carousel'),
          marginBottomLg  = document.querySelector('.u-mb-large');

    let sectionProjectsStyle    = window.getComputedStyle(sectionProjects),
        marginBottomLgStyle     = window.getComputedStyle(marginBottomLg),
        carouselStyle           = window.getComputedStyle(carousel),
        projectsMainHeight      = projectsMain.clientHeight,
        projectsTitleHeight     = projectsTitle.clientHeight,
        carouselHeight          = carousel.clientHeight;

    let projectsSectionPaddingTop = sectionProjectsStyle.paddingTop.match(regex) || sectionProjectsStyle.padding.match(regex)[0];
    let sectionProjectsEnd  =  projectsMainHeight + Number(projectsSectionPaddingTop);
    let carouselFromPaddingTop = projectsTitleHeight + Number(marginBottomLgStyle.marginBottom.match(regex));
    let carouselMid = carouselFromPaddingTop + carouselHeight + Number(carouselStyle.gridRowGap.match(regex))/2  - projectsTitleHeight/3;
    
    let projectsTitleFadeIn     = new TweenMax.from(projectsTitle, 0.000001, { autoAlpha: 0 });
    let projectsTitleFadeOut    = new TweenMax.to(projectsTitle, 0.000001, { autoAlpha: 0 });

    projectsScenes.push(

        new ScrollMagic.Scene({
            triggerElement: ".projects__title",
            offset: projectsTitleHeight/2,
            reverse: true })
        .setTween(projectsTitleFadeIn)
        .triggerHook(0.5)
        .addIndicators({ name: 'projectsTitleIn', indent: 200 }),

        new ScrollMagic.Scene({
            triggerElement: ".projects__title",
            offset: sectionProjectsEnd + projectsTitleHeight/2,
            reverse: true })
        .setTween(projectsTitleFadeOut)
        .triggerHook(0.5)
        .addIndicators({ name: 'projectsTitleOut', indent: 200, colorStart: 'red' }),

        new ScrollMagic.Scene({
            triggerElement: ".projects", 
            // duration: carouselFromPaddingTop - projectsTitleHeight,
            // duration: sectionProjectsEnd,
            duration: carouselMid,
            offset: projectsTitleHeight/2,
            reverse: true })
        .triggerHook(0.5)
        .setPin(".projects__title", {pushFollowers: false})
        .addIndicators({ name: 'projectsTitlePin', indent: 400})
        
    );

    return projectsScenes;
})();

export { projectsParallax };