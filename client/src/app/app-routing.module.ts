import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { KahootInitialComponent } from './components/kahoot-initial/kahoot-initial.component';

const routes: Routes = [
  { path: '', component: KahootInitialComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
