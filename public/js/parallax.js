window.addEventListener("DOMContentLoaded", init, false);

function init(e) {
    const header = document.querySelector('.header');
    
    header.addEventListener("mousemove", parallax, false);
    header.addEventListener("mouseout", parallaxReset, false);
};

function parallax(e) {
    e = e || window.event; // old IE support
    const mouseX = e.pageX;
    const mouseY = e.pageY;
    const viewportX = window.innerWidth;
    const viewportY = window.innerHeight;
    
    const headerLogo = document.querySelector('.header__logo');

    mouseParallax(headerLogo, viewportX, viewportY, mouseX, mouseY, Number(headerLogo.dataset.parallaxRotate), Number(headerLogo.dataset.parallaxTranslate));
}

function parallaxReset() {
    const headerLogo = document.querySelector('.header__logo');

    TweenLite.to(headerLogo, 1, {
        x: 0,
        y: 0,
        directionalRotation: {
            rotationX: 0,
            rotationY: 0
        },
        ease: Quad.easeOut,
        overwrite: 'all'
    });
}

function mouseParallax(element, viewportX, viewportY, mouseX, mouseY, offsetRotate, offsetTranslate) {
    translateX = (mouseX - viewportX/2) * offsetTranslate;
    translateY = (mouseY - viewportY/2) * offsetTranslate;

    rotateX = -(mouseY - viewportY/2) / (viewportY/2) * 45 * offsetRotate;
    rotateY = (mouseX - viewportX/2) / (viewportX/2) * 45 * offsetRotate;
    
    rotateX += '_short';
    rotateY += '_short';
    
    TweenLite.to(element, 1, {
        x: translateX,
        y: translateY,
        directionalRotation: {
            rotationX: rotateX,
            rotationY: rotateY
        },
        ease: Power2.easeOut,
        overwrite: 'all'
    });
};