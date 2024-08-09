import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutPageComponent } from './pages/main-layout-page/main-layout-page.component';
import { ContactsComponent } from './components/contacts/contacts.component';
import { AddNewContactComponent } from './components/add-new-contact/add-new-contact.component';
import { authGuard } from '../auth/guards/auth.guard.guard';
import { DashboardComponent } from './components/dashboard/dashboard.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    component: MainLayoutPageComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'contacts', component: ContactsComponent },
      { path: 'add-contact', component: AddNewContactComponent },
      { path: 'edit-contact/:id', component: AddNewContactComponent },
      { path: 'sales', loadChildren: () => import('./components/sales/sales.module').then(module => module.SalesModule) },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
