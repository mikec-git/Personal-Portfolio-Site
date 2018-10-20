(function startSmoothScroll() {    
    const scrollDist = Number(350); // Increase for greater distance
    const scrollDuration = .45;     // Increase for longer scroll
    
    window.addEventListener('mousewheel', scroll, false);
    window.addEventListener('DOMMouseScroll', scroll, false);
    
    function scroll(e) {
        if(!e.ctrlKey) { // Check if user wants to zoom screen
            e = e || window.event; // old IE support
            
            let delta = Math.max(-1, Math.min(1, (e.deltaY || e.detail)));
            let posFromTop      = window.pageYOffset;
            let finalScrollPos  = posFromTop + delta * scrollDist;
            
            TweenMax.to(window, scrollDuration, {
                scrollTo: { y: finalScrollPos, autoKill: false },
                ease: Power1.easeOut,
                overwrite: 'all'
            });
            
            e.preventDefault();
        }
    }
})();