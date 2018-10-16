// MATH UTILITY Object
let mathProto = function() {
};

// Clamps number to min or max value
mathProto.prototype.clamp = function(num, min, max) {
    return Math.min(Math.max(num, min), max);
};
// Radians to degree conversion
mathProto.prototype.RAD_to_DEG = function(){
    return 180 / Math.PI;
};


// Main function
(function parallax() {    
    // New instance of math helper object
    const math = new mathProto();
    
    // All parallax elements
    let parallaxElements;
    
    // Mouse position relative to viewport
    let mouse = {X: null, Y: null};
    
    // Document position
    let scroll = {X: window.pageXOffset, Y: window.pageYOffset};
    
    // Viewport width and height
    let viewport = {X: null, Y: null};    
    
    // Transform values
    let rotateXActive,
        rotateYActive,
        translateXActive,
        translateYActive,

        rotateXPassive,
        rotateYPassive,
        translateXPassive,
        translateYPassive;
    
    // Original position before active transform
    let originalRotation = [],
        originalTranslation = [];

    window.addEventListener("DOMContentLoaded", init, false);
    
    // INIT
    function init(e) {
        parallaxElements = document.querySelectorAll('.parallax');
        parallaxElements.forEach((element, index) => {
            ({rotation: originalRotation[index], translation: originalTranslation[index]} = decomposeMatrix(element));
            console.log(typeof parallaxElements);
        });

        // window.addEventListener("mousemove", mouseSetup, false);
        window.addEventListener("mousewheel", scrollSetup, false);        
        window.addEventListener('DOMMouseScroll', scrollSetup, false);
        window.addEventListener("mouseout", reset, false);

    };
    
    // // MOUSE MOVEMENT SETUP
    // function mouseSetup(e) {
    //     e           = e || window.event; // old IE support        
    //     mouse.X      = e.clientX;
    //     mouse.Y      = e.clientY;
    //     viewport.X   = window.innerWidth;
    //     viewport.Y   = window.innerHeight;     

    //     parallaxElements.forEach(element => {
    //         if(element.dataset.parallaxRotateActive || element.dataset.parallaxTranslateActive){
    //             mouseParallax(element,
    //                 Number(element.dataset.parallaxRotateActive), 
    //                 Number(element.dataset.parallaxTranslateActive)
    //             );
    //         }
    //     });
    // };
    
    // // MOUSE MOVEMENT PARALLAX
    // function mouseParallax(element, offsetRotateActive, offsetTranslateActive) {
    //     // Rotate Amount
    //     rotateXActive = -(mouse.Y-viewport.Y/2) / (viewport.Y/2) * 45 * offsetRotateActive + '_short';
    //     rotateYActive = (mouse.X-viewport.X/2) / (viewport.X/2) * 45 * offsetRotateActive + '_short';
        
    //     // Mouse translate Amount
    //     translateXActive = (mouse.X - viewport.X/2) * offsetTranslateActive;
    //     translateYActive = (mouse.Y - viewport.Y/2) * offsetTranslateActive;

    //     TweenLite.to(element, 1, {
    //         x: translateXActive + translateXPassive + originalTranslation.X,
    //         y: translateYActive + translateYPassive + originalTranslation.Y,
    //         directionalRotation: {
    //             rotationX: rotateXActive + rotateXPassive + originalRotation.X,
    //             rotationY: rotateYActive + rotateYPassive + originalRotation.Y
    //         },
    //         ease: Power2.easeOut,
    //         overwrite: 0
    //     });
    // };

    // SCROLL MOVEMENT SETUP
    function scrollSetup(e) {
        // Pixels scrolled from top or left of document
        scroll.X = window.pageXOffset;
        scroll.Y = window.pageYOffset;
    };

    // SCROLL MOVEMENT PARALLAX
    function scrollParallax(element, offsetRotateXPassive, offsetRotateYPassive, offsetTranslateXPassive, offsetTranslateYPassive) {
        parallaxElements.forEach(element => {
            if(element.dataset.parallaxRotatePassiveX || element.dataset.parallaxRotatePassiveY || 
            element.dataset.parallaxTranslatePassiveX || element.dataset.parallaxTranslatePassiveY){
                scrollParallax(element,
                    Number(element.dataset.parallaxRotatePassiveX), 
                    Number(element.dataset.parallaxRotatePassiveY), 
                    Number(element.dataset.parallaxTranslatePassiveX),
                    Number(element.dataset.parallaxTranslatePassiveY)
                );
            }
        });

        // Rotate Amount
        rotateXPassive = -scroll.X * offsetRotateXPassive + '_short';
        rotateYPassive = scroll.Y * offsetRotateYPassive + '_short';
        
        // Mouse translate Amount
        translateXPassive = scroll.X * offsetTranslateXPassive;
        translateYPassive = scroll.Y * offsetTranslateYPassive;

        TweenLite.to(element, 1, {
            x: translateXPassive,
            y: translateYPassive,
            directionalRotation: {
                rotationX: rotateXPassive + originalRotation.X,
                rotationY: rotateYPassive + originalRotation.Y
            },
            ease: Power2.easeOut,
            overwrite: 0
        });
    };

    // RESET
    function reset() {
        parallaxElements.forEach(element => {
            if(element.dataset.parallaxRotateActive || element.dataset.parallaxTranslateActive) {
                resetParallax(element);
            }
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
        
        rotation.Y = -Math.asin(math.clamp(matrix.m13, -1, 1)) * math.RAD_to_DEG();
        if (Math.abs(matrix.m13) < 0.99999) {
            rotation.X = Math.atan2(-matrix.m23, matrix.m33) * math.RAD_to_DEG();
            rotation.Z = Math.atan2(-matrix.m12, matrix.m11) * math.RAD_to_DEG();
        } else {
            rotation.X = Math.atan2(matrix.m32, matrix.m22) * math.RAD_to_DEG();
            rotation.Z = 0;
        }
        
        ([translation.X, translation.Y, translation.Z] = [matrix.m41, matrix.m42, matrix.m43]);
        
        // Returns CURRENT position of element (even if its moving)
        return {rotation, translation};
    }
})();