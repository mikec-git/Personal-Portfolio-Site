// MATH UTILITY Object
let mathProto = function() {
    // Radians to degree conversion
    this.RAD_to_DEG =  180 / Math.PI;
};
// Clamps number to min or max value
mathProto.prototype.clamp = function(num, min, max) {
    return Math.min(Math.max(num, min), max);
};

// Main function
(function parallax() {    
    // New instance of math helper object
    const math = new mathProto();
    
    // All parallax elements
    let parallaxElementsList = document.querySelectorAll('.parallax'),
        parallaxElements = [];
    
    // Mouse position relative to viewport
    let mouse = {x: null, y: null};
    // Document position
    let scroll = {x: window.pageXOffset, y: window.pageYOffset};    
    // Viewport width and height
    let viewport = {x: null, x: null};    
    
    // Transform values
    let rotateXActive,
        rotateYActive,
        translateXActive,
        translateYActive,

        rotateXPassive,
        rotateYPassive,
        translateXPassive,
        translateYPassive;
    
    let rotX,
        rotY;
    
    // Comparison variables for loop
    let oldPassive = {translateX: null, translateY: null, rotateX: null, rotateY: null};
    
    window.addEventListener("DOMContentLoaded", init, false);
    
    // INIT
    function init(e) {
        parallaxElementsList.forEach(element => {
            ({rotation, translation} = decomposeMatrix(element));

            parallaxElements.push({
                el:     element, 
                x:      translation.X,  // Original x-translation
                y:      translation.Y,  // Original y-translation
                rotX:   rotation.X,     // Original x-rotation
                rotY:   rotation.Y,     // Original y-rotation
                offsetRotActive:     Number(element.dataset.parallaxRotateActive),
                offsetTransActive:   Number(element.dataset.parallaxTranslateActive),
                offsetRotPassiveX:   Number(element.dataset.parallaxRotatePassiveX),
                offsetRotPassiveY:   Number(element.dataset.parallaxRotatePassiveY),
                offsetTransPassiveX: Number(element.dataset.parallaxTranslatePassiveX),
                offsetTransPassiveY: Number(element.dataset.parallaxTranslatePassiveY)
            });
        });

        window.addEventListener("mousemove", mouseSetup, false);
        window.addEventListener("scroll", scrollSetup, false);        
        window.addEventListener("mousewheel", scrollSetup, false);        
        window.addEventListener('DOMMouseScroll', scrollSetup, false);
        window.addEventListener("mouseout", reset, false);
    };
    
    // MOUSE MOVEMENT SETUP
    function mouseSetup(e) {
        e           = e || window.event; // old IE support        
        mouse.x      = e.clientX;
        mouse.y      = e.clientY;
        viewport.x   = window.innerWidth;
        viewport.y   = window.innerHeight;

        mouseParallax();
    };
    
    // MOUSE MOVEMENT PARALLAX
    function mouseParallax() {
        parallaxElements.forEach(element => {
            if(element.offsetRotActive || element.offsetTransActive) {
                // Need for initial state when scroll not triggered
                rotateXPassive      = !isNaN(element.offsetRotPassiveX) ? -scroll.x * element.offsetRotPassiveX : element.rotX;
                rotateYPassive      = !isNaN(element.offsetRotPassiveY) ? scroll.y * element.offsetRotPassiveY : element.rotY;
                translateXPassive   = !isNaN(element.offsetTransPassiveX) ? scroll.x * element.offsetTransPassiveX : element.x;
                translateYPassive   = !isNaN(element.offsetTransPassiveY) ? scroll.y * element.offsetTransPassiveY : element.y;

                // Rotate Amount
                rotateXActive = !isNaN(element.offsetRotActive) ? -(mouse.y-viewport.y/2) / (viewport.y/2) * 45 * element.offsetRotActive : element.rotX;
                rotateYActive = !isNaN(element.offsetRotActive) ? (mouse.x-viewport.y/2) / (viewport.y/2) * 45 * element.offsetRotActive : element.rotY;
                
                // Mouse translate Amount
                translateXActive = !isNaN(element.offsetTransActive) ? (mouse.x - viewport.y/2) * element.offsetTransActive : element.x;
                translateYActive = !isNaN(element.offsetTransActive) ? (mouse.y - viewport.y/2) * element.offsetTransActive : element.y;
                
                rotX = (rotateXActive + rotateXPassive) + '_short';
                rotY = (rotateYActive + rotateYPassive) + '_short';

                TweenMax.to(element.el, 1, {
                    x: translateXActive + translateXPassive,
                    y: translateYActive + translateYPassive,
                    directionalRotation: {
                        rotationX: rotX,
                        rotationY: rotY
                    },
                    ease: Power2.easeOut,
                    overwrite: 0
                });
            }
        })
    };

    // SCROLL MOVEMENT SETUP
    function scrollSetup() {
        // Pixels scrolled from top or left of document
        scroll.x = window.pageXOffset;
        scroll.y = window.pageYOffset;
        scrollParallax();
    };
    
    // SCROLL MOVEMENT PARALLAX
    function scrollParallax() {
        parallaxElements.forEach(element => {
            if(element.offsetRotPassiveX || element.offsetRotPassiveY || element.offsetTransPassiveX || element.offsetTransPassiveY){
                // Comparison with old values
                oldPassive.translateY = translateYPassive;
                oldPassive.translateX = translateXPassive;
                oldPassive.rotateX = rotateXPassive;
                oldPassive.rotateY = rotateYPassive;

                // Need for initial state when mouse not triggered
                rotateXActive       = !isNaN(element.offsetRotActive) ? -(mouse.y-viewport.y/2) / (viewport.y/2) * 45 * element.offsetRotActive : element.rotX;
                rotateYActive       = !isNaN(element.offsetRotActive) ? (mouse.x-viewport.y/2) / (viewport.y/2) * 45 * element.offsetRotActive : element.rotY;
                translateXActive    = !isNaN(element.offsetTransActive) ? (mouse.x - viewport.y/2) * element.offsetTransActive : element.x;
                translateYActive    = !isNaN(element.offsetTransActive) ? (mouse.y - viewport.y/2) * element.offsetTransActive : element.y;

                // Rotate Amount
                rotateXPassive = !isNaN(element.offsetRotPassiveX) ? -scroll.x * element.offsetRotPassiveX : element.rotX;
                rotateYPassive = !isNaN(element.offsetRotPassiveY) ? scroll.y * element.offsetRotPassiveY : element.rotY;

                // Mouse translate Amount
                translateXPassive = !isNaN(element.offsetTransPassiveX) ? scroll.x * element.offsetTransPassiveX : element.x;
                translateYPassive = !isNaN(element.offsetTransPassiveY) ? scroll.y * element.offsetTransPassiveY : element.y;

                rotX = (rotateXPassive + rotateXActive) + '_short';
                rotY = (rotateYPassive + rotateYActive) + '_short';
    
                if(oldPassive.translateY !== translateYPassive || oldPassive.translateX !== translateXPassive || 
                oldPassive.rotateX !== rotateXPassive || oldPassive.rotateY !== rotateYPassive){
                    TweenMax.to(element.el, 0, {
                        x: translateXPassive + translateXActive,
                        y: translateYPassive + translateYActive,
                        directionalRotation: {
                            rotationX: rotX,
                            rotationY: rotY
                        },
                        ease: Power0.easeOut,
                        overwrite: 2
                    });
                }
            }
        });
    };

    // RESET
    function reset() {
        parallaxElements.forEach(element => {
            console.log("ran");
            TweenMax.to(element.el, 1, {
                x: translateXPassive,
                y: translateYPassive,
                directionalRotation: {
                    rotationX: rotateXPassive + '_short',
                    rotationY: rotateYPassive + '_short'
                },
                ease: Expo.easeOut,
                overwrite: 1
            });
        });
    };

    // RESET PARALLAX
    function resetParallax(element) {
        // Returns transform values to original before active transform (including any passive scroll transforms)
        TweenLite.to(element, 1, {
            x: originalTranslation.X + translateXPassive,
            y: originalTranslation.Y  + translateYPassive,
            directionalRotation: {
                rotationX: originalRotation.X + rotateXPassive,
                rotationY: originalRotation.Y + rotateYPassive
            },
            ease: Quad.easeOut,
            overwrite: 0
        });
    };

    // DECOMPOSE 3D-TRANSFORM MATRIX
    function decomposeMatrix(element) {
        // Get style values for parallaxed element
        let style = window.getComputedStyle(element);

        // Get 3D matrix object for element
        let matrix = new WebKitCSSMatrix(style.webkitTransform);
        
        // Decompose the matrix values
        let rotation = { X: null, Y: null, Z: null };
        let translation = { X: null, Y: null, Z: null };
        
        rotation.Y = -Math.asin(math.clamp(matrix.m13, -1, 1)) * math.RAD_to_DEG;
        if (Math.abs(matrix.m13) < 0.99999) {
            rotation.X = Math.atan2(-matrix.m23, matrix.m33) * math.RAD_to_DEG;
            rotation.Z = Math.atan2(-matrix.m12, matrix.m11) * math.RAD_to_DEG;
        } else {
            rotation.X = Math.atan2(matrix.m32, matrix.m22) * math.RAD_to_DEG;
            rotation.Z = 0;
        }
        
        ([translation.X, translation.Y, translation.Z] = [matrix.m41, matrix.m42, matrix.m43]);
        
        // Returns CURRENT position of element (even if its moving)
        return {rotation, translation};
    }
})();