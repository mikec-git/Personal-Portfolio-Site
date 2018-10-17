// Main function
(function parallax() {    
    // New instance of math helper object
    const math = new mathProto();
    
    // All parallax elements
    let parallaxElementsList    = document.querySelectorAll('.parallax'),
        parallaxElements        = [];    
    
    let mouse           = { x: window.clientX, y: window.clientY },         // Mouse position relative to viewport    
        scroll          = { x: window.pageXOffset, y: window.pageYOffset }, // Document position    
        viewport        = {},                                               // Viewport width and height    
        documentHeight  = document.body.clientHeight;                       // Entire document height
    
    // Transform values
    let rotate          = {},
        translate       = {},
        scale           = {},
        opacity         = {},
        totalTransform  = {};

    window.addEventListener("DOMContentLoaded", init, false);
    
    // INIT
    function init() {
        let rotationInit, translationInit,  scaleInit, opacityInit, displayInit,
            offsetTransPassiveX,            offsetTransPassiveY,
            offsetRotPassiveX,              offsetRotPassiveY,
            offsetScalePassiveX,            offsetScalePassiveY,
            offsetOpacity;

        parallaxElementsList.forEach(element => {
            // Get initial values of element
            ({rotationInit, translationInit, scaleInit, opacityInit, displayInit} = decomposeMatrix(element));
            
            if(!!element.dataset.parallaxRotatePassive) {
                [offsetRotPassiveX, offsetRotPassiveY] = regexSeparation(element.dataset.parallaxRotatePassive);
            } else {
                [offsetRotPassiveX, offsetRotPassiveY] = [NaN, NaN];
            }

            if(!!element.dataset.parallaxTranslatePassive) {
                [offsetTransPassiveX, offsetTransPassiveY] = regexSeparation(element.dataset.parallaxTranslatePassive);
            } else {
                [offsetTransPassiveX, offsetTransPassiveY] = [NaN, NaN];
            }

            if(!!element.dataset.parallaxScalePassive) {
                [offsetScalePassiveX, offsetScalePassiveY] = regexSeparation(element.dataset.parallaxScalePassive);
            } else {
                [offsetScalePassiveX, offsetScalePassiveY] = [NaN, NaN];
            }

            if(!!element.dataset.parallaxOpacity) {
                offsetOpacity = regexSeparation(element.dataset.parallaxOpacity);
            } else {
                offsetOpacity = NaN;
            }

            parallaxElements.push({
                el:         element, 
                x:          translationInit.X,  // Original x-translation
                y:          translationInit.Y,  //    ||    y-translation
                rotX:       rotationInit.X,     //    ||    x-rotation
                rotY:       rotationInit.Y,     //    ||    y-rotation
                scaleX:     scaleInit.X,        //    ||    x-scale
                scaleY:     scaleInit.Y,        //    ||    y-scale
                opacity:    opacityInit,        //    ||    opacity
                display:    displayInit,        //    ||    display
                
                offsetRotActive:        Number(element.dataset.parallaxRotateActive),
                offsetTransActive:      Number(element.dataset.parallaxTranslateActive),
                
                offsetRotPassiveX:      Number(offsetRotPassiveX),
                offsetRotPassiveY:      Number(offsetRotPassiveY),
                offsetTransPassiveX:    Number(offsetTransPassiveX),
                offsetTransPassiveY:    Number(offsetTransPassiveY),
                offsetScalePassiveX:    Number(offsetScalePassiveX),
                offsetScalePassiveY:    Number(offsetScalePassiveY),
                
                offsetOpacity:          Number(offsetOpacity)
            });
        });
        window.addEventListener("mousemove", mouseSetup, false);
        window.addEventListener("scroll", scrollSetup, false);        
        window.addEventListener("mousewheel", scrollSetup, false);        
        window.addEventListener('DOMMouseScroll', scrollSetup, false);
        window.addEventListener("mouseout", reset, false);
        reset();
    };
    
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
        mouse.x      = e.clientX;           // Horizontal mouse position
        mouse.y      = e.clientY;           // Vertical mouse position
        viewport.x   = window.innerWidth;   // Viewport width
        viewport.y   = window.innerHeight;  // Viewport Height
        mouseParallax();
    };
    
    // MOUSE MOVEMENT PARALLAX
    function mouseParallax() {
        parallaxElements.forEach(element => {
            if(element.offsetRotActive || element.offsetTransActive) {
                // Need for initial state when scroll not triggered
                calculatePassive(element);
                calculateActive(element);                
                calculateTotal();
                
                if(element.el.getBoundingClientRect().bottom > 0 && element.el.getBoundingClientRect().top < viewport.y && opacity.passive > 0) {
                    TweenMax.to(element.el, 1, {
                        x: totalTransform.translateX,
                        y: totalTransform.translateY,
                        directionalRotation: {
                            rotationX: totalTransform.rotateX,
                            rotationY: totalTransform.rotateY
                        },
                        scaleX: totalTransform.scaleX,
                        scaleY: totalTransform.scaleY,
                        opacity: totalTransform.opacity,
                        ease: Power2.easeOut,
                        overwrite: 0
                    });
                }
            }
        })
    };

    let scrollTimeout = null;
    // SCROLL MOVEMENT SETUP
    function scrollSetup() {
        scroll.y = window.pageYOffset; // Vertical scrolled amount
        
        if(scrollTimeout){
            clearTimeout(scrollTimeout);
        }
        // Set timer so it only fires every 10 seconds for scrolling, otherwise its too taxing
        scrollTimeout = setTimeout(scrollParallax, 10);
    };
    
    // SCROLL MOVEMENT PARALLAX
    function scrollParallax() {
        parallaxElements.forEach(element => {
            if(element.offsetRotPassiveX || element.offsetRotPassiveY || 
            element.offsetTransPassiveX || element.offsetTransPassiveY || 
            element.offsetScalePassiveX || element.offsetScalePassiveY || element.offsetOpacity){
                // Need for initial state when mouse not triggered
                calculateActive(element);
                calculatePassive(element);
                calculateTotal();

                // Only triggers transforms if element is inside or below viewport
                if(element.el.getBoundingClientRect().bottom > 0 && opacity.passive > 0) {
                    TweenMax.to(element.el, .4, {
                        x: totalTransform.translateX,
                        y: totalTransform.translateY,
                        directionalRotation: {
                            rotationX: totalTransform.rotateX,
                            rotationY: totalTransform.rotateY
                        },
                        scaleX: totalTransform.scaleX,
                        scaleY: totalTransform.scaleY,
                        opacity: totalTransform.opacity,
                        ease: Power0.easeOut,
                        overwrite: 2
                    });
                }
            }
        });
    };

    function calculatePassive(element){
        // Scroll Rotate Amount
        rotate.passiveX = !!element.offsetRotPassiveX ? (-scroll.y * element.offsetRotPassiveX).toFixed(2) : element.rotX;
        rotate.passiveY = !!element.offsetRotPassiveY ? (scroll.y * element.offsetRotPassiveY).toFixed(2) : element.rotY;
        
        // Scroll Translate Amount
        translate.passiveX  = !!element.offsetTransPassiveX ? (scroll.y * element.offsetTransPassiveX).toFixed(2) : element.x;
        translate.passiveY  = !!element.offsetTransPassiveY ? (scroll.y * element.offsetTransPassiveY).toFixed(2) : element.y;
    
        // Scroll Scale Amount
        scale.passiveX = !!element.offsetScalePassiveX && scroll.y !== 0 ? ((scroll.y/documentHeight+1) * (1+element.offsetScalePassiveX)).toFixed(2) : element.scaleX;
        scale.passiveY = !!element.offsetScalePassiveY && scroll.y !== 0 ? ((scroll.y/documentHeight+1) * (1+element.offsetScalePassiveY)).toFixed(2) : element.scaleY;

        // Scroll Opacity Amount
        opacity.passive = !!element.offsetOpacity ? (element.opacity - (scroll.y/documentHeight*100 * element.offsetOpacity)) : element.opacity;
        element.el.style.display = (opacity.passive < 0) ? 'none' : `${element.display}`; // Disables element if 0 opacity
    }

    function calculateActive(element) {        
        // Mouse Rotate Amount
        rotate.activeX  = !!element.offsetRotActive ? (-(mouse.y-viewport.y/2) / (viewport.y/2) * 45 * element.offsetRotActive).toFixed(2) : 0;
        rotate.activeY  = !!element.offsetRotActive ? ((mouse.x-viewport.x/2) / (viewport.x/2) * 45 * element.offsetRotActive).toFixed(2) : 0;
        
        // Mouse Translate Amount
        translate.activeX   = !!element.offsetTransActive ? ((mouse.x - viewport.x/2) * element.offsetTransActive).toFixed(2) : 0;
        translate.activeY   = !!element.offsetTransActive ? ((mouse.y - viewport.y/2) * element.offsetTransActive).toFixed(2) : 0;
    }
    
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
    
                if(element.el.getBoundingClientRect().bottom > 0 && element.el.getBoundingClientRect().top < viewport.y && opacity.passive > 0) {
                    TweenMax.to(element.el, .8, {
                        x: translate.passiveX,
                        y: translate.passiveY,
                        directionalRotation: {
                            rotationX: rotate.passiveX + '_short',
                            rotationY: rotate.passiveY + '_short'
                        },
                        scaleX: scale.passiveX,
                        scaleY: scale.passiveX,
                        opacity: opacity.passive,
                        ease: Quad.easeOut,
                        overwrite: 3
                    });
                }
            });            
        }, 10);
    };

    // DECOMPOSE 3D-TRANSFORM MATRIX
    function decomposeMatrix(element) {
        // Get style values for parallaxed element
        let style = window.getComputedStyle(element);

        // Get 3D matrix object for element
        let matrix = new WebKitCSSMatrix(style.webkitTransform);

        // Decompose the matrix values
        let translationInit = {},
            rotationInit    = {},
            scaleInit       = {},
            opacityInit     = style.opacity,
            displayInit     = style.display;
        
        ([translationInit.X, translationInit.Y, translationInit.Z] = [matrix.m41, matrix.m42, matrix.m43]);

        rotationInit.Y = -Math.asin(math.clamp(matrix.m13, -1, 1)) * math.RAD_to_DEG;
        if (Math.abs(matrix.m13) < 0.99999) {
            rotationInit.X = Math.atan2(-matrix.m23, matrix.m33) * math.RAD_to_DEG;
            rotationInit.Z = Math.atan2(-matrix.m12, matrix.m11) * math.RAD_to_DEG;
        } else {
            rotationInit.X = Math.atan2(matrix.m32, matrix.m22) * math.RAD_to_DEG;
            rotationInit.Z = 0;
        }
        
        scaleInit.X = Math.sqrt(matrix.m11*matrix.m11 + matrix.m12*matrix.m12 + matrix.m13*matrix.m13);
        scaleInit.Y = Math.sqrt(matrix.m21*matrix.m21 + matrix.m22*matrix.m22 + matrix.m23*matrix.m23);
        scaleInit.Z = Math.sqrt(matrix.m31*matrix.m31 + matrix.m32*matrix.m32 + matrix.m33*matrix.m33);
        
        // Returns CURRENT position of element (even if its moving)
        return {rotationInit, translationInit, scaleInit, opacityInit, displayInit};
    }

    // MATH UTILITY Object
    function mathProto() {
        // Radians to degree conversion
        this.RAD_to_DEG =  180 / Math.PI;
    };
    // Clamps number to min or max value
    mathProto.prototype.clamp = function(num, min, max) {
        return Math.min(Math.max(num, min), max);
    };
})();