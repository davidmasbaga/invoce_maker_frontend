import { ChangeDetectorRef, Component } from '@angular/core';

import { ContactDataService } from '../../../services/contact-data.service';
import { InvoiceManagementService } from '../../../services/invoice-management.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  contacts: any;

  totalWithTaxes: number = 0;
  totalUnpaid: number = 0;
  totalPaid: number = 0;

  constructor(
   private contactDataService: ContactDataService,
   private invoiceManagementService: InvoiceManagementService,
   private cdr: ChangeDetectorRef,
  ) {
    this.contactDataService.getContactsByUserId().subscribe((data: any[]) => {
      this.contacts = data;
      this.cdr.detectChanges();
    });

    this.invoiceManagementService.getAllInvoices()
    if (this.invoiceManagementService.invoices$) {
      this.invoiceManagementService.invoices$.subscribe((invoices) => {console.log('Invoices received:', invoices)

        this.totalWithTaxes = 0;
        this.totalUnpaid = 0;
        this.totalPaid = 0;

        invoices.forEach(invoice => {
          this.totalWithTaxes += invoice.totalWithTaxes;

          if (invoice.state === 'unpaid') {
            this.totalUnpaid += invoice.totalWithTaxes;
          } else if (invoice.state === 'paid') {
            this.totalPaid += invoice.totalWithTaxes;
          }
        });

        this.cdr.detectChanges();
      });



        }
      }




    }




