import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DetailsComponent } from './details/details.component';
import { FarmComponent } from './farm/farm.component';
import { NewRegisterComponent } from './new-register/new-register.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'farm', component: FarmComponent },
  { path: 'details/:id', component: DetailsComponent },
  { path: 'register', component: NewRegisterComponent },
  { path: 'edit/:id', component: NewRegisterComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
