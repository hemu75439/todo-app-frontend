import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { CreateTaskComponent } from './tasks/create/create.component';
import { ListComponent } from './tasks/list/list.component';

const routes: Routes = [
  {path: '', component: ListComponent},
  {path: 'create', component: CreateTaskComponent, canActivate: [AuthGuard]},
  {path: 'edit/:taskId', component: CreateTaskComponent, canActivate: [AuthGuard]},
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignupComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
