import { trigger, style, animate, transition } from '@angular/animations';
import { animateTimer } from '../models/config';

export const fadeInOut = trigger('fadeInOut', [
    transition(":enter", [
      // :enter is an alias for 'void => *'
      style({opacity: 0}),
      animate(animateTimer, style({opacity: 1}))
    ]),
    transition(":leave", [
      // :leave is an alias for '* => void'
      animate(animateTimer, style({opacity: 0}))
    ])
  ]);