function scrollMagicControllerVertical() {
    let smController = new ScrollMagic.Controller();
    
    this.addToCtrl = function(sceneArray) {
        sceneArray.forEach(scene => scene.addTo(smController));
    }
}

function scrollMagicControllerHorizontal() {
    let smController = new ScrollMagic.Controller({vertical: false});
    
    this.addToCtrl = function(sceneArray) {
        sceneArray.forEach(scene => scene.addTo(smController));
    }
}

const smCtrlV = new scrollMagicControllerVertical();
const smctrlH = new scrollMagicControllerHorizontal();

export { smCtrlV, smctrlH };