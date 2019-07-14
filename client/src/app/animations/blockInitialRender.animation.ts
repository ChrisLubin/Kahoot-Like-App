import { trigger, transition } from '@angular/animations';

export const blockInitialRender = trigger('blockInitialRender', [
    transition(":enter", [] )
  ]);