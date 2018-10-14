// Background noise canvas image
(function noise() {
    window.addEventListener("DOMContentLoaded", init, false);

    let canvas,
        ctx,
        windowWidth,
        windowHeight;
    
    // Counter for looping over noiseData
    let imageFrame = 0;
    let numOfFrames = 10;
    // Array to keep numOfFrames number of rendered images
    let noiseData = [];
    
    function init(e) {
        e = e || window.event;
        
        canvas = document.querySelector('.noise');
        ctx = canvas.getContext('2d', {alpha: true});

        setupCanvas();
    }
    
    function setupCanvas() {
        windowWidth = document.documentElement.clientWidth;
        windowHeight = document.documentElement.clientHeight;

        canvas.width = windowWidth;
        canvas.height = windowHeight;

        generateImageDataArray();
    }
    
    function generateImageDataArray() {
        // Prerender images and store into array
        for(let i = 0; i < numOfFrames; i++) {
            generateData();
        }
        
        runLoop();
    }
    
    function generateData() {
        // Create the image data object
        let idata = ctx.createImageData(windowWidth, windowHeight);
        // Initialized view with all values of 0
        buffer32 = new Uint32Array(idata.data.buffer);
        let length = buffer32.length;
        
        for(let i = 0; i < length; i++) {
            // Half of the data, at random, will be opaque black
            if(Math.random() < 0.5) {
                buffer32[i] = 0xff000000;
            }
        }
        
        noiseData.push[idata];
    }

    function runLoop() {
        imageFrame = (imageFrame >= numOfFrames) ? 0 : imageFrame++;

        ctx.putImageData(noiseData[imageFrame], 0, 0);

        requestAnimationFrame(runLoop);
    }



})();