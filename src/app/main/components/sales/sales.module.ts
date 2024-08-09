import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { SalesRoutingModule } from './sales-routing.module';
import { InvoicesComponent } from './invoices/invoices.component';
import { AddNewInvoiceComponent } from './add-new-invoice/add-new-invoice.component';
import { BudgetsComponent } from './budgets/budgets.component';
import { AddNewBudgetComponent } from './add-new-budget/add-new-budget.component';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [
    InvoicesComponent,
    AddNewInvoiceComponent,
    BudgetsComponent,
    AddNewBudgetComponent
  ],
  imports: [
    CommonModule,
    SalesRoutingModule,
    MatIconModule,
    ReactiveFormsModule
  ]
})
export class SalesModule { }
