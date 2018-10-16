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
        totalTransform  = {};

    window.addEventListener("DOMContentLoaded", init, false);
    
    // INIT
    function init() {
        let rotation, translation, scale,
            offsetTransPassiveX, offsetTransPassiveY,
            offsetRotPassiveX, offsetRotPassiveY,
            offsetScalePassiveX, offsetScalePassiveY;

        parallaxElementsList.forEach(element => {
            ({rotation, translation, scale} = decomposeMatrix(element)); // Get initial positions of element
            
            if(element.dataset.parallaxRotatePassive) {
                [offsetRotPassiveX, offsetRotPassiveY] = regexSeparation(element.dataset.parallaxRotatePassive);
            }

            if(element.dataset.parallaxTranslatePassive) {
                [offsetTransPassiveX, offsetTransPassiveY] = regexSeparation(element.dataset.parallaxTranslatePassive);
            }

            if(element.dataset.parallaxScalePassive) {
                [offsetScalePassiveX, offsetScalePassiveY] = regexSeparation(element.dataset.parallaxScalePassive);
            }

            parallaxElements.push({
                el:     element, 
                x:      translation.X,  // Original x-translation
                y:      translation.Y,  //    ||    y-translation
                rotX:   rotation.X,     //    ||    x-rotation
                rotY:   rotation.Y,     //    ||    y-rotation
                scaleX: scale.X,        //    ||    x-scale
                scaleY: scale.Y,        //    ||    y-scale
                
                offsetRotActive:     Number(element.dataset.parallaxRotateActive),
                offsetTransActive:   Number(element.dataset.parallaxTranslateActive),

                offsetRotPassiveX:   Number(offsetRotPassiveX),
                offsetRotPassiveY:   Number(offsetRotPassiveY),
                offsetTransPassiveX: Number(offsetTransPassiveX),
                offsetTransPassiveY: Number(offsetTransPassiveY),
                offsetScalePassiveX: Number(offsetScalePassiveX),
                offsetScalePassiveY: Number(offsetScalePassiveY)
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
        let regex = /[^,\s]+/g;        
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
                
                if(element.el.getBoundingClientRect().bottom > 0 && element.el.getBoundingClientRect().top < viewport.y) {
                    TweenMax.to(element.el, 1, {
                        x: totalTransform.translateX,
                        y: totalTransform.translateY,
                        directionalRotation: {
                            rotationX: totalTransform.rotateX,
                            rotationY: totalTransform.rotateY
                        },
                        scaleX: totalTransform.scaleX,
                        scaleY: totalTransform.scaleY,
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
            element.offsetScalePassiveX || element.offsetScalePassiveY){
                // Need for initial state when mouse not triggered
                calculateActive(element);
                calculatePassive(element);
                calculateTotal();

                TweenMax.to(element.el, .4, {
                    x: totalTransform.translateX,
                    y: totalTransform.translateY,
                    directionalRotation: {
                        rotationX: totalTransform.rotateX,
                        rotationY: totalTransform.rotateY
                    },
                    scaleX: totalTransform.scaleX,
                    scaleY: totalTransform.scaleY,
                    ease: Power0.easeOut,
                    overwrite: 2
                });
            }
        });
    };

    function calculatePassive(element){
        // Scroll Rotate Amount
        rotate.passiveX = !!element.offsetRotPassiveX ? (-scroll.y * element.offsetRotPassiveX).toFixed(2) : element.rotX;
        rotate.passiveY = !!element.offsetRotPassiveY ? (scroll.y * element.offsetRotPassiveY).toFixed(2) : element.rotY;
        
        // Scroll Translate Amount
        translate.passiveX  = !!element.offsetTransPassiveX ? (scroll.y * element.offsetTransPassiveX).toFixed(2) : element.x;
        translate.passiveY  = !!element.offsetTransPassiveY ?( scroll.y * element.offsetTransPassiveY).toFixed(2) : element.y;
    
        // Scroll Scale Amount
        scale.passiveX = !!element.offsetScalePassiveX && scroll.y !== 0 ? ((scroll.y/documentHeight+1) * (1+element.offsetScalePassiveX)).toFixed(2) : element.scaleX;
        scale.passiveY = !!element.offsetScalePassiveY && scroll.y !== 0 ? ((scroll.y/documentHeight+1) * (1+element.offsetScalePassiveY)).toFixed(2) : element.scaleY;
    }

    function calculateActive(element) {        
        // Mouse Rotate Amount
        rotate.activeX  = !!element.offsetRotActive ? (-(mouse.y-viewport.y/2) / (viewport.y/2) * 45 * element.offsetRotActive).toFixed(2) : element.rotX;
        rotate.activeY  = !!element.offsetRotActive ? ((mouse.x-viewport.x/2) / (viewport.x/2) * 45 * element.offsetRotActive).toFixed(2) : element.rotY;
        
        // Mouse Translate Amount
        translate.activeX   = !!element.offsetTransActive ? ((mouse.x - viewport.x/2) * element.offsetTransActive).toFixed(2) : element.x;
        translate.activeY   = !!element.offsetTransActive ? ((mouse.y - viewport.y/2) * element.offsetTransActive).toFixed(2) : element.y;
    }
    
    function calculateTotal() {
        // Sums of active and passive components (limited angles to 20deg)
        totalTransform.rotateX = math.clamp(Number(rotate.passiveX) + Number(rotate.activeX), -15, 15) + '_short';
        totalTransform.rotateY = math.clamp(Number(rotate.passiveY) + Number(rotate.activeY), -15, 15) + '_short';

        totalTransform.translateX = translate.passiveX + translate.activeX;
        totalTransform.translateY = translate.passiveY + translate.activeY;

        totalTransform.scaleX = scale.passiveX;
        totalTransform.scaleY = scale.passiveY;
    }

    // RESET
    function reset() {
        parallaxElements.forEach(element => {
            calculatePassive(element);
            calculateActive(element);

            if(element.el.getBoundingClientRect().bottom > 0 && element.el.getBoundingClientRect().top < viewport.y) {
                TweenMax.to(element.el, .8, {
                    x: translate.passiveX,
                    y: translate.passiveY,
                    directionalRotation: {
                        rotationX: rotate.passiveX + '_short',
                        rotationY: rotate.passiveY + '_short'
                    },
                    scaleX: scale.passiveX,
                    scaleY: scale.passiveX,
                    ease: Quad.easeOut,
                    overwrite: 3
                });
            }
        });
    };

    // DECOMPOSE 3D-TRANSFORM MATRIX
    function decomposeMatrix(element) {
        // Get style values for parallaxed element
        let style = window.getComputedStyle(element);

        // Get 3D matrix object for element
        let matrix = new WebKitCSSMatrix(style.webkitTransform);
        
        // Decompose the matrix values
        let translation = {},
            rotation    = {},
            scale       = {};
        
        ([translation.X, translation.Y, translation.Z] = [matrix.m41, matrix.m42, matrix.m43]);

        rotation.Y = -Math.asin(math.clamp(matrix.m13, -1, 1)) * math.RAD_to_DEG;
        if (Math.abs(matrix.m13) < 0.99999) {
            rotation.X = Math.atan2(-matrix.m23, matrix.m33) * math.RAD_to_DEG;
            rotation.Z = Math.atan2(-matrix.m12, matrix.m11) * math.RAD_to_DEG;
        } else {
            rotation.X = Math.atan2(matrix.m32, matrix.m22) * math.RAD_to_DEG;
            rotation.Z = 0;
        }
        
        scale.X = Math.sqrt(matrix.m11*matrix.m11 + matrix.m12*matrix.m12 + matrix.m13*matrix.m13);
        scale.Y = Math.sqrt(matrix.m21*matrix.m21 + matrix.m22*matrix.m22 + matrix.m23*matrix.m23);
        scale.Z = Math.sqrt(matrix.m31*matrix.m31 + matrix.m32*matrix.m32 + matrix.m33*matrix.m33);
        
        // Returns CURRENT position of element (even if its moving)
        return {rotation, translation, scale};
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