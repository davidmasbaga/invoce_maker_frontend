import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvoicesComponent } from './invoices/invoices.component';
import { AddNewInvoiceComponent } from './add-new-invoice/add-new-invoice.component';
import { BudgetsComponent } from './budgets/budgets.component';
import { AddNewBudgetComponent } from './add-new-budget/add-new-budget.component';

const routes: Routes = [

  {path: '', redirectTo: 'invoices', pathMatch: 'full'},
  {path: 'invoices', component: InvoicesComponent},
  {path: 'invoices/add', component: AddNewInvoiceComponent},
  {path: 'budgets', component: BudgetsComponent},
  {path: 'budgets/add', component: AddNewBudgetComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesRoutingModule { }
