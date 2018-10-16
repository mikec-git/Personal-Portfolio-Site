// Main function
(function parallax() {    
    // New instance of math helper object
    const math = new mathProto();
    
    // All parallax elements
    let parallaxElementsList = document.querySelectorAll('.parallax'),
        parallaxElements = [];
    
    // Mouse position relative to viewport
    let mouse = {x: window.clientX, y: window.clientY};
    
    // Document position
    let scroll = {x: window.pageXOffset, y: window.pageYOffset};

    // Viewport width and height
    let viewport = {};
    
    // Transform values
    let rotate      = {},
        translate   = {};

    // Contains total calculated transform values
    let total = {};
    
    window.addEventListener("DOMContentLoaded", init, false);
    
    // INIT
    function init() {
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
        reset();
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

                TweenMax.to(element.el, 1, {
                    x: total.translateX,
                    y: total.translateY,
                    directionalRotation: {
                        rotationX: total.rotateX,
                        rotationY: total.rotateY
                    },
                    ease: Power2.easeOut,
                    overwrite: 0
                });
            }
        })
    };

    // SCROLL MOVEMENT SETUP
    function scrollSetup() {
        scroll.x = window.pageXOffset; // Horizontal scrolled amount
        scroll.y = window.pageYOffset; // Vertical scrolled amount
        scrollParallax();
    };
    
    // SCROLL MOVEMENT PARALLAX
    function scrollParallax() {
        parallaxElements.forEach(element => {
            if(element.offsetRotPassiveX || element.offsetRotPassiveY || element.offsetTransPassiveX || element.offsetTransPassiveY){
                // Need for initial state when mouse not triggered
                calculateActive(element);
                calculatePassive(element);
                calculateTotal();

                TweenMax.to(element.el, 0, {
                    x: total.translateX,
                    y: total.translateY,
                    directionalRotation: {
                        rotationX: total.rotateX,
                        rotationY: total.rotateY
                    },
                    ease: Power0.easeOut,
                    overwrite: 2
                });
            }
        });
    };

    function calculatePassive(element){
        // Scroll Rotate Amount
        rotate.passiveX      = !isNaN(element.offsetRotPassiveX) ? -scroll.x * element.offsetRotPassiveX : element.rotX;
        rotate.passiveY      = !isNaN(element.offsetRotPassiveY) ? scroll.y * element.offsetRotPassiveY : element.rotY;
        // Scroll Translate Amount
        translate.passiveX   = !isNaN(element.offsetTransPassiveX) ? scroll.x * element.offsetTransPassiveX : element.x;
        translate.passiveY   = !isNaN(element.offsetTransPassiveY) ? scroll.y * element.offsetTransPassiveY : element.y;
    }

    function calculateActive(element) {
        // Mouse Rotate Amount
        rotate.activeX  = !isNaN(element.offsetRotActive) ? -(mouse.y-viewport.y/2) / (viewport.y/2) * 45 * element.offsetRotActive : element.rotX;
        rotate.activeY  = !isNaN(element.offsetRotActive) ? (mouse.x-viewport.x/2) / (viewport.x/2) * 45 * element.offsetRotActive : element.rotY;
        // Mouse Translate Amount
        translate.active    = !isNaN(element.offsetTransActive) ? (mouse.x - viewport.x/2) * element.offsetTransActive : element.x;
        translate.activeY   = !isNaN(element.offsetTransActive) ? (mouse.y - viewport.y/2) * element.offsetTransActive : element.y;
    }

    function calculateTotal() {
        // Sums of active and passive components
        total.rotateX = (rotate.passiveX + rotate.activeX) + '_short';
        total.rotateY = (rotate.passiveY + rotate.activeY) + '_short';
        total.translateX = translate.passiveX + translate.activeX;
        total.translateY = translate.passiveY + translate.activeY;
    }

    // RESET
    function reset() {
        parallaxElements.forEach(element => {
            calculatePassive(element);

            TweenMax.to(element.el, .75, {
                x: translate.passiveX,
                y: translate.passiveY,
                directionalRotation: {
                    rotationX: rotate.passiveX + '_short',
                    rotationY: rotate.passiveY + '_short'
                },
                ease: Quad.easeOut,
                overwrite: 3
            });
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