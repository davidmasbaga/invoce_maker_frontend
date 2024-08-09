import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainRoutingModule } from './main-routing.module';
import { MainLayoutPageComponent } from './pages/main-layout-page/main-layout-page.component';
import { ContactsComponent } from './components/contacts/contacts.component';
import { SharedModule } from '../shared/shared.module';
import { AddNewContactComponent } from './components/add-new-contact/add-new-contact.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AddNewInvoiceComponent } from './components/sales/add-new-invoice/add-new-invoice.component';
import { SalesModule } from './components/sales/sales.module';


@NgModule({
  declarations: [
    MainLayoutPageComponent,
    ContactsComponent,
    AddNewContactComponent,
    DashboardComponent,

  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    SharedModule,
    RouterModule,
    ReactiveFormsModule,
    MatIconModule,
    SalesModule
  ]
})
export class MainModule { }
