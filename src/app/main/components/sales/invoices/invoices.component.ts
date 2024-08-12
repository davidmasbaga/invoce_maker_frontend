import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { InvoiceDataServiceService } from '../../../../services/invoice-data.service';
import { Invoice } from '../../../../models/invoice.interface';
import { InvoiceManagementService } from '../../../../services/invoice-management.service';
import { map } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrl: './invoices.component.css'
})
export class InvoicesComponent implements OnInit {

public invoices: Invoice[] = [];

constructor(

  public invoiceManagementService: InvoiceManagementService,
  private cd : ChangeDetectorRef,
 public invoiceDataService: InvoiceDataServiceService,
 private router: Router
) { }
  ngOnInit(): void {
    this.invoiceManagementService.getAllInvoices()
    if (this.invoiceManagementService.invoices$) {
      this.invoiceManagementService.invoices$.
      pipe(map(invoices => invoices.filter(invoice => invoice.status === 'final')))
      .subscribe(invoices => {console.log('Invoices received:', invoices);});
    }


  }


  generateNewInvoiceId(): void {
    this.invoiceDataService.createDraftInvoice().subscribe(res => {
      console.log(res);
      // Redirige a la ruta dinámica con el ID
      this.router.navigate(['/inicio/sales/invoices/add', res.invoiceId]);
    });
  }


  deleteInvoice(invoiceId: string): void {
    this.invoiceDataService.deleteInvoice(invoiceId).subscribe()

  }


}
