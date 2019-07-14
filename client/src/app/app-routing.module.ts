import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InitialComponent } from './components/initial/initial.component';

const routes: Routes = [
  { path: '', component: InitialComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
