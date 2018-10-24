window.addEventListener("DOMContentLoaded", renderOffScreenCanvases, false);
window.addEventListener("resize", renderOffScreenCanvases, false);

let canvas = document.querySelector('.carousel-item__img');
let ctx;

let imgList = ['../src/img/projects/yelpcamp_test.png', '../src/img/projects/project_test1.png', '../src/img/projects/project_test2.png', '../src/img/projects/project_test3.png'];
let imgLength = imgList.length;
let offCanvasList = {};
let canvasDim;

// RENDERS OFF SCREEN CANVASES FOR EFFICIENT LOADING
function renderOffScreenCanvases() {        
    canvasDim   = { x: canvas.clientWidth, y: canvas.clientHeight };
    canvas.width    = canvasDim.x;
    canvas.height   = canvasDim.y;
    ctx             = canvas.getContext('2d', {alpha: false});

    // RETURNS ARRAY OF PROMISES - EACH ELEMENT IS EACH IMAGE LOAD
    let promiseArray = imgList.map(imgUrl => {
        return new Promise((resolve, reject) => {
            let offCanvas = generateCanvas(canvasDim.x, canvasDim.y);
            let offCanvasCtx = offCanvas.getContext('2d', {alpha: false});
            let imgTemp = new Image();
            imgTemp.onload = function(){
                offCanvasCtx.drawImage(imgTemp, 0, 0, canvasDim.x, canvasDim.y);
                offCanvasList[imgUrl] = offCanvas;
                resolve();
            };
            imgTemp.src = imgUrl;
        })
    });
    
    Promise.all(promiseArray).then(() => {
        ctx.drawImage(offCanvasList[imgList[0]], 0, 0, canvasDim.x, canvasDim.y);
    });
}

// GENERATES A BLANK CANVAS
function generateCanvas(canvasX, canvasY) {
    let offScreenCanvas     = document.createElement('canvas');
    offScreenCanvas.width   = canvasX;
    offScreenCanvas.height  = canvasY;
    return offScreenCanvas;
}

// FUNCTION THAT DRAWS THE IMAGES ONTO THE CANVAS BASED ON SCROLL POS
function start(e, imgNum) {
    if(!!e && Object.keys(offCanvasList).length === imgList.length && offCanvasList.constructor === Object) {
        let progress = e.progress.toFixed(4);
        let xPos = canvasDim.x - canvasDim.x * progress;
    
        ctx.clearRect(0, 0, canvasDim.x, canvasDim.y);
        
        ctx.drawImage(offCanvasList[imgList[imgNum]], 
            0, 0, xPos, canvasDim.y,
            0, 0, xPos, canvasDim.y);

        ctx.drawImage(offCanvasList[imgList[imgNum+1]], 
            xPos, 0, canvasDim.x, canvasDim.y, 
            xPos, 0, canvasDim.x, canvasDim.y);
    
        if(progress > 0 && progress < 1) {
            ctx.fillRect(xPos, 0, 5, canvasDim.y);
        }
    }
}    

export { start, imgLength };