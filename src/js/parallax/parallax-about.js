// CORNER LOGO
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
    
// ABOUT TITLE
let aboutSectionPaddingBottom = regex.exec(window.getComputedStyle(document.querySelector('.section-about')).padding)[0];
let sectionAboutEnd           =  document.querySelector('.section-about').clientHeight - Number(aboutSectionPaddingBottom);

let aboutTitleFadeIn    = new TimelineMax(),
    aboutTitleFadeOut   = new TimelineMax(),
    aboutSceneEnd       = new TimelineMax();

aboutTitleFadeIn.from(aboutTitle, 0.000001, { autoAlpha: 0 });
aboutTitleFadeOut.to(aboutTitle, 0.000001, { autoAlpha: 0 });
aboutSceneEnd
    .to(noiseCanvas, 0.5, { autoAlpha: 0, ease: Quad.easeOut})
    .to(noiseContainer, 0.5, { backgroundColor: 'gray', ease: Quad.easeOut }, 0);

new ScrollMagic.Scene({
    triggerElement: ".about__title",
    offset: aboutTitle.clientHeight/2,
    reverse: true
})
.setTween(aboutTitleFadeIn)
.triggerHook(0.5)
.addIndicators({ name: 'aboutTitlePinIn', indent: 200 })
.addTo(smController);

new ScrollMagic.Scene({
    triggerElement: ".about__title",
    offset: sectionAboutEnd + aboutTitle.clientHeight/2,
    reverse: true })
    .setTween(aboutTitleFadeOut)
    .triggerHook(0.5)
    .addIndicators({ name: 'aboutTitleFadeOut', indent: 700 })
    .addTo(smController);

new ScrollMagic.Scene({
    triggerElement: ".about__title",
    offset: sectionAboutEnd + aboutTitle.clientHeight/2,
    reverse: true })
    .setTween(aboutSceneEnd)
    .triggerHook(0.5)
    .addIndicators({ name: 'aboutTitlePinOut', indent: 200, colorStart: 'red' })
    .addTo(smController);

let aboutTitlePin = new ScrollMagic.Scene({
    triggerElement: ".about__title", 
    duration: sectionAboutEnd,
    offset: aboutTitle.clientHeight/2,
    reverse: true })
    .triggerHook(0.5)
    .setPin(".about__title", {pushFollowers: false})
    .addIndicators({ name: 'aboutTitlePin' })
    .addTo(smController);

// PROJECTS TITLE
let projectsSectionPaddingTop = window.getComputedStyle(document.querySelector('.section-projects')).padding.match(regex)[0];
let sectionProjectsEnd        =  document.querySelector('.projects').clientHeight + Number(projectsSectionPaddingTop);

let projectsTitleFadeIn     = new TweenMax.from(projectsTitle, 0.000001, { autoAlpha: 1 });
let projectsTitleFadeOut    = new TweenMax.to(projectsTitle, 0.000001, { autoAlpha: 0 });

new ScrollMagic.Scene({
    triggerElement: ".projects__title",
    offset: projectsTitle.clientHeight/2,
    reverse: true })
    .setTween(projectsTitleFadeIn)
    .triggerHook(0.5)
    .addIndicators({ name: 'projectsTitlePinIn', indent: 200 })
    .addTo(smController);

new ScrollMagic.Scene({
    triggerElement: ".projects__title",
    offset: sectionProjectsEnd + projectsTitle.clientHeight/2,
    reverse: true })
    .setTween(projectsTitleFadeOut)
    .triggerHook(0.5)
    .addIndicators({ name: 'projectsTitlePinOut', indent: 200, colorStart: 'red' })
    .addTo(smController);

let projectsTitlePin = new ScrollMagic.Scene({
    triggerElement: ".projects", 
    duration: sectionProjectsEnd,
    offset: projectsTitle.clientHeight/2,
    reverse: true })
    .triggerHook(0.5)
    .setPin(".projects__title", {pushFollowers: false})
    .addIndicators({ name: 'projectsTitlePin', indent: 400})
    .addTo(smController);