function scrollMagicControllerVertical() {
    let smController = new ScrollMagic.Controller();
    
    this.addToCtrl = function(sceneArray) {
        sceneArray.forEach(scene => scene.addTo(smController));
    }
}

const smCtrlV = new scrollMagicControllerVertical();

export { smCtrlV };