import { trigger, style, animate, transition } from '@angular/animations';

export const fadeInOut = trigger('fadeInOut', [
    transition(":enter", [
      // :enter is an alias for 'void => *'
      style({opacity: 0}),
      animate(250, style({opacity: 1}))
    ]),
    transition(":leave", [
      // :leave is an alias for '* => void'
      animate(250, style({opacity: 0}))
    ])
  ]);