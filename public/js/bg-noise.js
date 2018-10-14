// Background noise canvas image
(function noise() {
    window.addEventListener("DOMContentLoaded", init, false);

    let canvas,
        ctx,
        windowWidth,
        windowHeight,
        idata;
    
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

        idata = ctx.createImageData(windowWidth, windowHeight);
        buffer32 = new Uint32Array(idata.data.buffer);

        let length = buffer32.length;
        for(let i = 0; i < length; i++) {
            if(Math.random() < 0.5) {
                buffer32[i] = 0xff000000;
            }
        }

        noiseData.push[idata];
    }
})();