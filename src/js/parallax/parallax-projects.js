import { regex, viewport } from './parallax-config';
import { start, imgLength } from '../carousel';
import { smCtrlV } from './parallax-controller';

window.addEventListener('resize', onPageResize, false);

const sectionProjects = document.querySelector('.section-projects'),
      projectsMain    = document.querySelector('.projects'),
      projectsTitle   = document.querySelector('.projects__title'),
      carousel        = document.querySelector('.carousel'),
      marginBottomLg  = document.querySelector('.u-mb-large'),          
      noiseContainer  = document.querySelector('.noise-body');

const projectsTitleFadeIn1        = new TweenMax.from(projectsTitle, 0.000001, { autoAlpha: 0 }),
      projectsTitleFadeOut1       = new TweenMax.to(projectsTitle, 0.000001, { autoAlpha: 0 }),  
      backgroundColorSlideChange1 = new TweenMax.to(noiseContainer, 0.75, { backgroundColor: '#AEEEEE' }),
      backgroundColorSlideChange2 = new TweenMax.to(noiseContainer, 0.75, { backgroundColor: '#BDD9C0' }),
      backgroundColorSlideChange3 = new TweenMax.to(noiseContainer, 0.75, { backgroundColor: '#D2D2D2' });

let projectsScenes      = projectScenesArrayNoReset(),
    resetScenes         = projectScenesArrayReset(),
    projectsParallax    = [...projectsScenes, ...resetScenes];

let resetTimeout = null;

// PROJECTS SECTION
function projectScenesArrayNoReset() {
    let projectsScenes = [];

    let marginBottomLgStyle     = window.getComputedStyle(marginBottomLg),
        projectsTitleHeight     = projectsTitle.clientHeight,
        carouselHeight          = carousel.clientHeight;

    let carouselFromPaddingTop  = projectsTitleHeight + Number(marginBottomLgStyle.marginBottom.match(regex)),  
        carouselMid             = carouselFromPaddingTop + carouselHeight/2;    

    projectsScenes.push(
        // =============================================================== //
        //                       BACKGROUND COLOR                          //
        // =============================================================== //
        // BG COLOR CHANGE 1
        new ScrollMagic.Scene({
            triggerElement: ".projects__title",
            offset: carouselMid,
            reverse: true })
        .triggerHook(0.5)
        .setTween(backgroundColorSlideChange1)
        .addIndicators({ name: 'bgColorChange', colorStart: 'green'}),

        // BG COLOR CHANGE 2
        new ScrollMagic.Scene({
            triggerElement: ".projects__title",
            offset: carouselMid + viewport.x*0.9 + viewport.y*.5*2,
            reverse: true })
        .triggerHook(0.5)
        .setTween(backgroundColorSlideChange2)
        .addIndicators({ name: 'bgColorChange', colorStart: 'green'}),

        // BG COLOR CHANGE 3
        new ScrollMagic.Scene({
            triggerElement: ".projects__title",
            offset: carouselMid + viewport.x*0.9*2 + viewport.y*.5*3,
            reverse: true })
        .triggerHook(0.5)
        .setTween(backgroundColorSlideChange3)
        .addIndicators({ name: 'bgColorChange', colorStart: 'green'})        
    );

    return projectsScenes;
};

function projectScenesArrayReset() {
    let resetScenes = [];

    let sectionProjectsStyle    = window.getComputedStyle(sectionProjects),
        marginBottomLgStyle     = window.getComputedStyle(marginBottomLg);

    let projectsMainHeight      = projectsMain.clientHeight,
        projectsTitleHeight     = projectsTitle.clientHeight,
        carouselHeight          = carousel.clientHeight;

    let projectsSectionPaddingTop = sectionProjectsStyle.paddingTop.match(regex) || sectionProjectsStyle.padding.match(regex)[0],    sectionProjectsEnd        = projectsMainHeight + Number(projectsSectionPaddingTop),
        carouselFromPaddingTop    = projectsTitleHeight + Number(marginBottomLgStyle.marginBottom.match(regex)),
        carouselMid               = carouselFromPaddingTop + carouselHeight/2;    

    resetScenes.push(       
        // =============================================================== //
        //                         PROJECT TITLE                           //
        // =============================================================== //
        // // TITLE FADE IN 1
        new ScrollMagic.Scene({
            triggerElement: ".projects__title",
            offset: projectsTitleHeight/2,
            reverse: true })
        .setTween(projectsTitleFadeIn1)
        .triggerHook(0.5)
        .addIndicators({ name: 'projectsTitleIn1', indent: 100 }),

        // // TITLE FADE OUT 1
        new ScrollMagic.Scene({
            triggerElement: ".projects__title",
            offset: sectionProjectsEnd,
            reverse: true })
        .setTween(projectsTitleFadeOut1)
        .triggerHook(0.5)
        .addIndicators({ name: 'projectsTitleOut1', indent: 200, colorStart: 'red' }),

        // TITLE PIN
        new ScrollMagic.Scene({
            triggerElement: ".projects__title", 
            offset: projectsTitleHeight/2,
            duration: sectionProjectsEnd - projectsTitleHeight/2,
            reverse: true })
        .triggerHook(0.5)
        .setPin(".projects__title", {pushFollowers: false})
        .addIndicators({ name: 'projectsTitlePin', indent: 400}),

        // =============================================================== //
        //                        CAROUSEL START                           //
        // =============================================================== //
        // CAROUSEL PIN FOR DURATION OF HORIZONTAL SCROLLING
        new ScrollMagic.Scene({
            triggerElement: ".projects",
            offset: carouselMid,
            duration: viewport.x*0.9*3 + viewport.y*.5*3,
            reverse: true })
        .setPin('.carousel', {pushFollowers: false})
        .addIndicators({ name: 'pinProjects', colorStart: 'blue'}),
    );
    
    // =============================================================== //
    //                        CAROUSEL WIPE                            //
    // =============================================================== //
    for(let i = 0; i < imgLength-1; i++) {
        resetScenes.push(
            new ScrollMagic.Scene({
                triggerElement: ".projects",
                offset: carouselMid + viewport.x*0.9*i + viewport.y*0.5*(i+1),
                duration: viewport.x*0.9,
                reverse: true })
            .on('progress', e =>  { requestAnimationFrame(() => start(e, i)); })
            .addIndicators({ name: `IMG ${i+1}`})
        )
    }

    return resetScenes;
};

function onPageResize() {
    if(resetTimeout) {
        clearTimeout(resetTimeout);
    }

    resetTimeout = setTimeout(() => {
        resetScenes.forEach(scene => {
            scene.remove();
            scene.destroy(true);
        });
        
        resetScenes = projectScenesArrayReset();
        smCtrlV.addToCtrl(resetScenes);
    }, 400);
}

export { projectsParallax };