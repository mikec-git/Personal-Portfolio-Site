import { regex } from './parallax-config';

const headerParallax = (function() {
    let cornerLogo      = document.querySelector('.logo-box'),
        header          = document.querySelector('.header');
    
    let headerScenes = [];

    // CORNER LOGO
    let cornerLogoTween = TweenMax.to(cornerLogo, 0.5, {
        autoAlpha: 1,
        ease: Power3.easeOut
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