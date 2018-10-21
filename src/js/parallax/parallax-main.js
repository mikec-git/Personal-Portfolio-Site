import { smCtrl } from './parallax-controller';
import { headerParallax } from './parallax-header';
import { aboutParallax } from './parallax-about';
import { projectsParallax } from './parallax-projects';


smCtrl.addToCtrl(headerParallax);
smCtrl.addToCtrl(aboutParallax);
smCtrl.addToCtrl(projectsParallax);