import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { KahootInitialComponent } from './components/initial/initial.component';

const routes: Routes = [
  { path: '', component: KahootInitialComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
