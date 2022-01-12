import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FactsComponent } from './facts/facts.component';

const routes: Routes = [
  { path: '', component: FactsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
