import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule,FormControl, FormsModule, } from '@angular/forms';

import { SalesRoutingModule } from './sales-routing.module';
import { InvoicesComponent } from './invoices/invoices.component';
import { AddNewInvoiceComponent } from './add-new-invoice/add-new-invoice.component';
import { BudgetsComponent } from './budgets/budgets.component';
import { AddNewBudgetComponent } from './add-new-budget/add-new-budget.component';
import { MatIconModule } from '@angular/material/icon';

import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { SharedModule } from "../../../shared/shared.module";
import { PipesModule } from "../../../utils/pipes/pipes.module";


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
    ReactiveFormsModule,
    MatSelectModule,
    MatFormFieldModule,
    SharedModule,
    PipesModule
]
})
export class SalesModule { }
