import { smCtrlV } from './parallax-controller';
import { headerParallax } from './parallax-header';
import { aboutParallax } from './parallax-about';
import { projectsParallax } from './parallax-projects';


smCtrlV.addToCtrl(headerParallax);
smCtrlV.addToCtrl(aboutParallax);
smCtrlV.addToCtrl(projectsParallax);

// window.addEventListener('resize', smCtrlV.addToCtrl(projectsParallax), false);
