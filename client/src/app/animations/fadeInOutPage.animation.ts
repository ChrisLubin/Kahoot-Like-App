import { trigger, style, animate, transition } from '@angular/animations';
import { animateTimerPage } from '../models/config';

export const fadeInOutPage = trigger('fadeInOutPage', [
  transition(":leave", [
    // :leave is an alias for '* => void'
    animate(animateTimerPage, style({
      height: 5000,
      width: 5000,
      top: 0,
      bottom: 0,
      margin: 0
    }))
  ])
  ]);