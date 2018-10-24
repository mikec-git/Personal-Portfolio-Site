window.addEventListener("DOMContentLoaded", carouselInit, false);
window.addEventListener("resize", carouselInit, false);

let canvas = document.querySelector('.carousel-item__img');
let ctx;

let imgList = [ '../src/img/projects/yelpcamp_test.png',  'https://picsum.photos/1920/960',  'https://picsum.photos/1920/960', 'https://picsum.photos/1920/960' ];
let lengthList      = imgList.length;

const carouselInit = function() {
    let offCanvasList = [];
    renderOffScreenCanvases();    
    // RENDERS OFF SCREEN CANVASES FOR EFFICIENT LOADING
    function renderOffScreenCanvases() {        
        let canvasDim   = { x: canvas.clientWidth, y: canvas.clientHeight };
        canvas.width    = canvasDim.x;
        canvas.height   = canvasDim.y;
        ctx             = canvas.getContext('2d', {alpha: false});  
        
        for(let i = 0; i < lengthList; i++) {
            let offCanvas = generateCanvas(canvasDim.x, canvasDim.y);
            let offCanvasCtx = offCanvas.getContext('2d', {alpha: false});
            let imgTemp = new Image();
    
            imgTemp.onload = function(){
                console.log(imgTemp);
                offCanvasCtx.drawImage(imgTemp, 0, 0, canvasDim.x, canvasDim.y);
                offCanvasList.push(offCanvas);
            };
            imgTemp.src = imgList[i];
        }
    }

    // GENERATES A BLANK CANVAS
    function generateCanvas(canvasX, canvasY) {
        let offScreenCanvas     = document.createElement('canvas');
        offScreenCanvas.width   = canvasX;
        offScreenCanvas.height  = canvasY;

        return offScreenCanvas;
    }

    console.log(offCanvasList)
    return offCanvasList;
}

let list = carouselInit();
console.log(list);
// FUNCTION THAT DRAWS THE IMAGES ONTO THE CANVAS BASED ON SCROLL POS
function start(e, imgNum) {            
    if(imgNum && imgNum == 1) {         
        ctx.drawImage(list[0], 0, 0);
        console.log(imgNum);
        // ctx.clearRect(canvas.width - canvas.width*e.progress.toFixed(4), 0, canvas.width, canvas.height);
        // ctx.fillRect(canvas.width - canvas.width*e.progress.toFixed(4), 0, 5, canvas.height);
    }
}    
export { start };