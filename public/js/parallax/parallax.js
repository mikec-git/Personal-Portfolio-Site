// MAIN FUNCTION
(function parallax() {
    // MATH UTILITY
    function mathProto() {
        this.RAD_to_DEG =  180 / Math.PI; // Radians to degree conversion
    };    
    mathProto.prototype.clamp = function(num, min, max) { // Clamps number to min or max value
        return Math.min(Math.max(num, min), max);
    };
    
    const math = new mathProto(); // New instance of helper objects
    
    let mouse           = { x: window.clientX, y: window.clientY }, // Mouse position relative to viewport
        scroll          = { x: window.pageXOffset, y: window.pageYOffset }, // Current document scroll position
        viewport        = { x: document.documentElement.clientWidth, y: document.documentElement.clientHeight},
        documentHeight  = document.body.clientHeight;
        
        // All parallax elements
    let parallaxElementsList    = document.querySelectorAll('.parallax'),
        parallaxElements        = [];        
    
    // Transform values
    let rotate          = {},
        translate       = {},
        scale           = {},
        opacity         = {},
        totalTransform  = {};

    // Only run if parallax elements exist
    if(parallaxElementsList.length > 0) {
        window.addEventListener("DOMContentLoaded", init, false);
    }
    
    // INIT
    function init() {
        parallaxElementsList.forEach(element => assignStaticProperties(element));
        assignTranslateProperties();
        reset();

        window.addEventListener('mousemove', mouseSetup, false);
        window.addEventListener('scroll', scrollSetup, false);        
        window.addEventListener('mousewheel', scrollSetup, false);        
        window.addEventListener('DOMMouseScroll', scrollSetup, false);
        window.addEventListener('mouseout', reset, false);
        window.addEventListener('resize', () => {
            parallaxElements.forEach(element => assignTranslateProperties(element.el));
        }, false);
    };

    function assignStaticProperties(element) {
        TweenMax.set(element, {x: '+=0', y: '+=0', overwrite: false});

        let offsetTransPassiveX,        offsetTransPassiveY,
            offsetRotPassiveX,          offsetRotPassiveY,
            offsetScalePassiveX,        offsetScalePassiveY,
            offsetOpacity, hasPassive,  hasActive;
            
            [offsetRotPassiveX, offsetRotPassiveY] 
            = (!!element.dataset.parallaxRotatePassive) ? regexSeparation(element.dataset.parallaxRotatePassive) :  [NaN, NaN];
            
            [offsetTransPassiveX, offsetTransPassiveY] 
            = (!!element.dataset.parallaxTranslatePassive) ? regexSeparation(element.dataset.parallaxTranslatePassive) : [NaN, NaN];
            
            [offsetScalePassiveX, offsetScalePassiveY] 
            = (!!element.dataset.parallaxScalePassive) ? regexSeparation(element.dataset.parallaxScalePassive) : [NaN, NaN];

            offsetOpacity 
            = (!!element.dataset.parallaxOpacity) ? regexSeparation(element.dataset.parallaxOpacity)[0] : NaN;

            hasPassive = (!!element.dataset.parallaxRotatePassive || !!element.dataset.parallaxTranslatePassive || !!element.dataset.parallaxScalePassive || !!element.dataset.parallaxOpacity) ? true: false;

            hasActive = (!!element.dataset.parallaxRotateActive || !!element.dataset.parallaxTranslateActive) ? true : false;

            parallaxElements.push({
                el:         element,                    // Original 
                rotX:       element._gsTransform.rotationX.toFixed(5),  //    ||    x-rotation
                rotY:       element._gsTransform.rotationY.toFixed(5),  //    ||    y-rotation
                scaleX:     element._gsTransform.scaleX.toFixed(5),     //    ||    x-scale
                scaleY:     element._gsTransform.scaleY.toFixed(5),     //    ||    y-scale
                opacity:    window.getComputedStyle(element).opacity,   //    ||    opacity
                display:    window.getComputedStyle(element).display,   //    ||    display

                // Parallax values from html dataset
                ...(!!element.dataset.parallaxRotateActive ? {offsetRotActive: Number(element.dataset.parallaxRotateActive)} : {}),
                ...(!!element.dataset.parallaxTranslateActive ? {offsetTransActive: Number(element.dataset.parallaxTranslateActive)} : {}),
                ...(!!offsetRotPassiveX ? {offsetRotPassiveX: Number(offsetRotPassiveX)} : {}),
                ...(!!offsetRotPassiveY ? {offsetRotPassiveY: Number(offsetRotPassiveY)} : {}),
                ...(!!offsetTransPassiveX ? {offsetTransPassiveX: Number(offsetTransPassiveX)} : {}),
                ...(!!offsetTransPassiveY ? {offsetTransPassiveY: Number(offsetTransPassiveY)} : {}),
                ...(!!offsetScalePassiveX ? {offsetScalePassiveX: Number(offsetScalePassiveX)} : {}),
                ...(!!offsetScalePassiveY ? {offsetScalePassiveY: Number(offsetScalePassiveY)} : {}),
                ...(!!offsetOpacity ? {offsetOpacity: Number(offsetOpacity)} : {}),

                hasPassive: hasPassive,
                hasActive: hasActive
            });

            return parallaxElements.length-1;
    }
    
    // FOR VALUES THAT DEPEND ON RESIZING SCREEN
    function assignTranslateProperties() {
        parallaxElements.forEach(element => {
            element.x = element.el._gsTransform.x;  // Calculated x-translation
            element.y = element.el._gsTransform.y;  //     ||     y-translation
        });
        reset();
    }    
    
    // DATASET REGEX SEPARATION
    function regexSeparation(data) {
        let regex = /[^,\s+]+/g;        
        if(data){ 
            return data.match(regex); 
        }
    };
    
    // MOUSE MOVEMENT SETUP
    function mouseSetup(e) {
        e           = e || window.event;    // old IE support        
        mouse.x     = e.clientX;            // Horizontal mouse position
        mouse.y     = e.clientY;            // Vertical mouse position
        viewport.x  = document.documentElement.clientWidth;   // Viewport width
        viewport.y  = document.documentElement.clientHeight;  // Viewport Height
        
        mouseParallax();
    };
    
    // MOUSE MOVEMENT PARALLAX
    function mouseParallax() {
        parallaxElements.forEach(element => {
            // Need for initial state when scroll not triggered
            calculatePassive(element);
            calculateActive(element);                
            calculateTotal();
            
            if(element.hasActive && element.el.getBoundingClientRect().bottom > 0 && element.el.getBoundingClientRect().top < viewport.y && opacity.passive > -0.5) {
                TweenMax.to(element.el, 1, {
                    x: totalTransform.translateX,
                    y: totalTransform.translateY,
                    directionalRotation: {
                        rotationX: totalTransform.rotateX,
                        rotationY: totalTransform.rotateY
                    },
                    scaleX: totalTransform.scaleX,
                    scaleY: totalTransform.scaleY,
                    autoAlpha: math.clamp(opacity.passive, 0, 1),
                    ease: Power2.easeOut,
                    overwrite: 0
                });
            } 
        })
    };

    // SCROLL MOVEMENT SETUP
    let scrollTimeout = null;
    function scrollSetup() {
        scroll.y = window.pageYOffset; // Vertical scrolled amount
        
        if(scrollTimeout){
            clearTimeout(scrollTimeout);
        }
        // Set timer so it doesnt rapid fire like crazy, otherwise its too taxing
        scrollTimeout = setTimeout(scrollParallax, 10);
    };
    
    // SCROLL MOVEMENT PARALLAX
    function scrollParallax() {
        parallaxElements.forEach(element => {
            if(element.hasPassive) {
                // Need for initial state when mouse not triggered
                calculatePassive(element);
                calculateActive(element);
                calculateTotal();
                
                // Only triggers transforms if element is inside or below viewport
                if(element.el.getBoundingClientRect().bottom > 0 && element.el.getBoundingClientRect().top < viewport.y && opacity.passive > -0.5) {
                    TweenMax.to(element.el, 0.3, {
                        x: totalTransform.translateX,
                        y: totalTransform.translateY,
                        directionalRotation: {
                            rotationX: totalTransform.rotateX,
                            rotationY: totalTransform.rotateY
                        },
                        scaleX: totalTransform.scaleX,
                        scaleY: totalTransform.scaleY,
                        autoAlpha: math.clamp(opacity.passive, 0, 1),
                        ease: Power0.easeOut,
                        overwrite: 2
                    })
                }
            }
        });
    };

    // PASSIVE PARALLAX VALUES
    function calculatePassive(element) {
        // Scroll Rotate Amount
        rotate.passiveX = !!element.offsetRotPassiveX && scroll.y !== 0 ? (-scroll.y * element.offsetRotPassiveX).toFixed(7) : element.rotX;
        rotate.passiveY = !!element.offsetRotPassiveY && scroll.y !== 0 ? (scroll.y * element.offsetRotPassiveY).toFixed(7) : element.rotY;
        
        // Scroll Translate Amount
        translate.passiveX  = !!element.offsetTransPassiveX && scroll.y !== 0 ? (scroll.y * element.offsetTransPassiveX + element.x).toFixed(5) : element.x;
        translate.passiveY  = !!element.offsetTransPassiveY && scroll.y !== 0 ? (scroll.y * element.offsetTransPassiveY + element.y).toFixed(5) : element.y;
    
        // Scroll Scale Amount
        scale.passiveX = !!element.offsetScalePassiveX && scroll.y !== 0 ? ((scroll.y/documentHeight+1) * (1+element.offsetScalePassiveX)).toFixed(5) : element.scaleX;
        scale.passiveY = !!element.offsetScalePassiveY && scroll.y !== 0 ? ((scroll.y/documentHeight+1) * (1+element.offsetScalePassiveY)).toFixed(5) : element.scaleY;

        // Scroll Opacity Amount
        opacity.passive = !!element.offsetOpacity ? (element.opacity - (scroll.y/documentHeight*100 * element.offsetOpacity)).toFixed(7) : element.opacity;
    }
    
    // ACTIVE PARALLAX VALUES
    function calculateActive(element) {
        // Mouse Rotate Amount
        rotate.activeX  = !!element.offsetRotActive ? (-(mouse.y-viewport.y/2) / (viewport.y/2) * 45 * element.offsetRotActive).toFixed(5) : element.rotX;
        rotate.activeY  = !!element.offsetRotActive ? ((mouse.x-viewport.x/2) / (viewport.x/2) * 45 * element.offsetRotActive).toFixed(5) : element.rotY;
        
        // Mouse Translate Amount
        translate.activeX   = !!element.offsetTransActive ? ((mouse.x - viewport.x/2) * element.offsetTransActive).toFixed(5) : 0;
        translate.activeY   = !!element.offsetTransActive ? ((mouse.y - viewport.y/2) * element.offsetTransActive).toFixed(5) : 0;
    }

    // TOTAL PARALLAX VALUES
    function calculateTotal() {
        // Sums of active and passive components (limited angles to 20deg)
        totalTransform.rotateX = math.clamp(Number(rotate.passiveX) + Number(rotate.activeX), -15, 15) + '_short';
        totalTransform.rotateY = math.clamp(Number(rotate.passiveY) + Number(rotate.activeY), -15, 15) + '_short';

        totalTransform.translateX = translate.passiveX + translate.activeX;
        totalTransform.translateY = translate.passiveY + translate.activeY;

        totalTransform.scaleX   = scale.passiveX;
        totalTransform.scaleY   = scale.passiveY;

        totalTransform.opacity  = opacity.passive;
    }

    // RESET
    let resetTimeout = null;
    function reset() {
        if(resetTimeout){
            clearTimeout(resetTimeout);
        }
        
        resetTimeout = setTimeout(() => {
            parallaxElements.forEach(element => {
                calculatePassive(element);
                calculateActive(element);      
                
                if(element.el.getBoundingClientRect().bottom > 0 && element.el.getBoundingClientRect().top < viewport.y && opacity.passive > -0.5) {
                    TweenMax.to(element.el, .8, {
                        x: translate.passiveX,
                        y: translate.passiveY,
                        directionalRotation: {
                            rotationX: rotate.passiveX + '_short',
                            rotationY: rotate.passiveY + '_short'
                        },
                        scaleX: scale.passiveX,
                        scaleY: scale.passiveX,
                        autoAlpha: opacity.passive,
                        ease: Quad.easeOut,
                        overwrite: 3
                    });
                } 
            });            
        }, 10);
    };

    // DECOMPOSE VALUES THAT SHOULDN'T CHANGE NO MATTER WHAT
    // function decomposeMatrixStatic(element) {
    //     // Get style values for parallaxed element
    //     let style = window.getComputedStyle(element);
    //     // Get 3D matrix object for element
    //     let matrix = new WebKitCSSMatrix(style.webkitTransform);

    //     // Decompose the matrix values
    //     let rotationInit    = {},
    //         scaleInit       = {},
    //         opacityInit     = style.opacity,
    //         displayInit     = style.display;
        
    //     rotationInit.Y = -Math.asin(math.clamp(matrix.m13, -1, 1)) * math.RAD_to_DEG;
    //     if (Math.abs(matrix.m13) < 0.999999) {
    //         // rotationInit.X = Math.atan2(-matrix.m23, matrix.m33) * math.RAD_to_DEG;
    //         // rotationInit.Z = Math.atan2(-matrix.m12, matrix.m11) * math.RAD_to_DEG;
    //         rotationInit.X = -Math.atan2(matrix.m32, matrix.m33) * math.RAD_to_DEG; // For some reason this gives correct values, didnt do the math
    //         rotationInit.Z = Math.atan2(matrix.m21, matrix.m11) * math.RAD_to_DEG;
    //     } else {
    //         rotationInit.X = Math.atan2(matrix.m32, matrix.m22) * math.RAD_to_DEG;
    //         rotationInit.Z = 0;
    //     }
        
    //     scaleInit.X = Math.sqrt(matrix.m11*matrix.m11 + matrix.m12*matrix.m12 + matrix.m13*matrix.m13);
    //     scaleInit.Y = Math.sqrt(matrix.m21*matrix.m21 + matrix.m22*matrix.m22 + matrix.m23*matrix.m23);
    //     scaleInit.Z = Math.sqrt(matrix.m31*matrix.m31 + matrix.m32*matrix.m32 + matrix.m33*matrix.m33);

    //     return {rotationInit, scaleInit, opacityInit, displayInit};
    // }
})();