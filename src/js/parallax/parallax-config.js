window.addEventListener("DOMContentLoaded", getConfigValues, false);
window.addEventListener('resize', getConfigValues , false);

let documentHeight  = document.body.clientHeight,
    viewport        = {
        x: document.documentElement.clientWidth, 
        y: document.documentElement.clientHeight
    };
            
let regex           = /\d+/g;

function getConfigValues() {
    documentHeight  = document.body.clientHeight,
    viewport        = {
                        x: document.documentElement.clientWidth, 
                        y: document.documentElement.clientHeight
                      };
}

export { documentHeight, viewport, regex };