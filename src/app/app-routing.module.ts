import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'inicio', redirectTo: 'inicio/dashboard', pathMatch: 'full' },
  { path: 'inicio', loadChildren: () => import('./main/main.module').then(module => module.MainModule) },
  { path: '**', redirectTo: 'inicio/dashboard' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
