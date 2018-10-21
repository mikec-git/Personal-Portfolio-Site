let documentHeight  = document.body.clientHeight,
    viewport        = {
        x: document.documentElement.clientWidth, 
        y: document.documentElement.clientHeight
    };
    
let regex           = /\d+/g;

export { documentHeight, viewport, regex };