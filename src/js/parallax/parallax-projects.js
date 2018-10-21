import { regex } from './parallax-config';

// PROJECTS SECTION
const projectsParallax = (function() {
    let sectionProjects = document.querySelector('.section-projects'),
        projectsMain    = document.querySelector('.projects'),
        projectsTitle   = document.querySelector('.projects__title');

    let projectsScenes = [];

    let projectsSectionPaddingTop = window.getComputedStyle(sectionProjects).padding.match(regex)[0];
    let sectionProjectsEnd        =  projectsMain.clientHeight + Number(projectsSectionPaddingTop);
    
    let projectsTitleFadeIn     = new TweenMax.from(projectsTitle, 0.000001, { autoAlpha: 0 });
    let projectsTitleFadeOut    = new TweenMax.to(projectsTitle, 0.000001, { autoAlpha: 0 });
   
    projectsScenes.push(
        new ScrollMagic.Scene({
            triggerElement: ".projects__title",
            offset: projectsTitle.clientHeight/2,
            reverse: true })
        .setTween(projectsTitleFadeIn)
        .triggerHook(0.5)
        .addIndicators({ name: 'projectsTitlePinIn', indent: 200 }),

        new ScrollMagic.Scene({
            triggerElement: ".projects__title",
            offset: sectionProjectsEnd + projectsTitle.clientHeight/2,
            reverse: true })
        .setTween(projectsTitleFadeOut)
        .triggerHook(0.5)
        .addIndicators({ name: 'projectsTitlePinOut', indent: 200, colorStart: 'red' }),

        new ScrollMagic.Scene({
            triggerElement: ".projects", 
            duration: sectionProjectsEnd,
            offset: projectsTitle.clientHeight/2,
            reverse: true })
        .triggerHook(0.5)
        .setPin(".projects__title", {pushFollowers: false})
        .addIndicators({ name: 'projectsTitlePin', indent: 400})
    );

    return projectsScenes;
})();

export { projectsParallax };