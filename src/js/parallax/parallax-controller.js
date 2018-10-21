function scrollMagicController() {
    let smController = new ScrollMagic.Controller();
    
    this.addToCtrl = function(sceneArray) {
        sceneArray.forEach(scene => scene.addTo(smController));
    }
}

const smCtrl = new scrollMagicController();

export { smCtrl };