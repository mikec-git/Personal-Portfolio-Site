// Background noise canvas image
(function noise() {
    window.addEventListener('DOMContentLoaded', init, false);
    
    let canvas,
        ctx,
        windowWidth,
        windowHeight;
    
    // Counter for looping over noiseData
    let imageFrame  = 0,
        numOfFrames = 10;
    
    // Array to keep numOfFrames number of rendered images
    let noiseData;
    
    // Loop timeout ID
    let timeoutID,
        resizeTimeoutID;
    
    let resetCounter = 0;
        
    function init(e) {
        e = e || window.event;
        
        canvas = document.querySelector('.noise');
        ctx = canvas.getContext('2d', {alpha: true});

        if(resetCounter === 0) {
            window.addEventListener('resize', reset, false);
            resetCounter = 1;
        }
        setupCanvas();
    }
    
    function setupCanvas() {
        windowWidth = document.documentElement.clientWidth;
        windowHeight = document.documentElement.clientHeight;
        
        canvas.width = windowWidth;
        canvas.height = windowHeight;

        noiseData = [];
        
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
            // Half of the data, at random, will be black
            if(Math.random() < 0.5) {
                buffer32[i] = 0x66050505;
                // buffer32[i] = 0x11050505;
            } else {
                buffer32[i] = 0xff0e0e0e;
                // buffer32[i] = 0x110e0e0e;
            }
        }
        
        noiseData.push(idata);
    }

    function runLoop() {
        // Loops imagedata from array back
        imageFrame = (imageFrame < numOfFrames-1) ? imageFrame + 1 : 0;

        ctx.putImageData(noiseData[imageFrame], 0, 0);

        // Gives breathing room between each loop refresh
        timeoutID = setTimeout(() => {
            requestAnimationFrame(runLoop);
        }, 40);
    }

    function reset() {
        clearTimeout(resizeTimeoutID);

        // Refreshes new image background after set timeout
        resizeTimeoutID = setTimeout(() => {
            clearTimeout(timeoutID);
            init();
        }, 5);
    }

})();