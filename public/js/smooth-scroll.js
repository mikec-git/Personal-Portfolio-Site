const scrollDist = Number(350);
const scrollDuration = .45;

window.addEventListener('mousewheel', scroll, false);
window.addEventListener('DOMMouseScroll', scroll, false);

function scroll(e) {
    if(!e.ctrlKey) {        
        e = e || window.event; // old IE support
        
        let delta = Math.max(-1, Math.min(1, (e.deltaY || e.detail)));
        let posFromTop = window.pageYOffset;
        let finalScrollPos = posFromTop + delta*scrollDist;
        
        TweenLite.to(window, scrollDuration, {
            scrollTo: { y: finalScrollPos, autoKill: false },
            ease: Power1.easeOut,
            overwrite: 'all'
        });
        
        
        e.preventDefault();
    }
}