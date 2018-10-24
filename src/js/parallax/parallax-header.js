import { regex, viewport } from './parallax-config';

const headerParallax = (function() {
    let cornerLogo          = document.querySelector('.logo-box'),
        header              = document.querySelector('.header'),
        headerFirstName     = document.querySelector('.header__first-name'),
        headerLastName      = document.querySelector('.header__last-name'),
        headerDescription   = document.querySelector('.header__description'),
        headerLetter        = document.querySelectorAll('.header__letter'),
        headerLogo          = document.querySelector('.header__logo'),
        headerLogoBox       = document.querySelector('.header__logo-box'),
        headerMainTitle     = document.querySelector('.header__main-title'),
        headerSecondaryTitle = document.querySelector('.header__secondary-title');
        
    // INCLUDES ALL THE OPACITY FADE COMPONENTS IN THE HEADER
    let headerOpacityComponents 
    = [headerFirstName, headerLastName, headerDescription, ...headerLetter, headerLogo, headerMainTitle, headerSecondaryTitle, headerLogoBox];

    let headerScenes = [];

    // TOP CORNER LOGO
    let cornerLogoTween = TweenMax.to(cornerLogo, 0.5, {
        autoAlpha: 1,
        ease: Power3.easeOut
    });

    // PUSHING SCENES TO SCENES ARRAY
    headerOpacityComponents.forEach(element => {
        headerScenes.push(
            new ScrollMagic.Scene({
                triggerElement: ".header",
                duration: '100%',
                offset: viewport.y/2,
                reverse: true })
            .setTween(new TweenMax.to(element, 2, { autoAlpha: 0, ease: Quad.easeOut })) 
            .addIndicators({ name: 'letterStart', indent: 200, colorStart: 'red' })
        );
    });
        
    headerScenes.push(
        new ScrollMagic.Scene({
            triggerElement: ".header",
            offset: header.clientHeight/2,
            reverse: true })
        .setTween(cornerLogoTween)
    );

    return headerScenes;
})();

export { headerParallax };