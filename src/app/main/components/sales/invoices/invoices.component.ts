import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { InvoiceDataServiceService } from '../../../../services/invoice-data.service';
import { Invoice } from '../../../../models/invoice.interface';
import { InvoiceManagementService } from '../../../../services/invoice-management.service';
import { map, Subject, take, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { DialogService } from '../../../../services/dialogs.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrl: './invoices.component.css',
})
export class InvoicesComponent implements OnInit, OnDestroy {
  public invoiceTotals: any;
  public invoices: Invoice[] = [];

  private destroy$: Subject<void> = new Subject<void>();
  constructor(
    public invoiceManagementService: InvoiceManagementService,
    private cd: ChangeDetectorRef,
    public invoiceDataService: InvoiceDataServiceService,
    private router: Router,
    private dialogService: DialogService
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  ngOnInit(): void {
    this.invoiceManagementService.getAllInvoices();
    if (this.invoiceManagementService.invoices$) {
      this.invoiceManagementService.invoices$
        .pipe(
          map((invoices) =>
            invoices.filter((invoice) => invoice.status === 'final')
          ),
          take(1),
          takeUntil(this.destroy$)
        )
        .subscribe();
    }
  }

  generateNewInvoiceId(): void {
    this.invoiceDataService.createDraftInvoice().subscribe((res) => {
      console.log(res);

      this.router.navigate(['/inicio/sales/invoices/add', res.invoiceId]);
    });
  }

  calculateAllInvoicesTotalWithTaxes(invoicesArray: any[]): any {
    let totalWithTaxes = 0;
    let totalWithoutTaxes = 0;
    invoicesArray.forEach((invoice) => {
      totalWithTaxes += invoice.totalWithTaxes;
    });
    invoicesArray.forEach((invoice) => {
      totalWithoutTaxes += invoice.subtotal;
    });
    return { totalWithTaxes, totalWithoutTaxes };
  }

  confirmDeleteInvoice(invoice: any) {
    const userId = localStorage.getItem('userId');

    if (userId) {
      const data = {
        icon: 'error',
        color: '',
        message: `¿Seguro que desea eliminar esta factura de tu lista ?`,
        accept: 'Sí, estoy seguro',
        cancel: 'Cancelar',
      };

      const dialogRef: MatDialogRef<any, any> = this.dialogService.openDialog(
        data,
        { width: '500px' }
      );

      dialogRef.afterClosed().subscribe((result) => {
        if (result === true) {
          this.deleteInvoice(invoice);
        }
      });
    }
  }

  deleteInvoice(invoiceId: string) {
    this.invoiceDataService
      .deleteInvoice(invoiceId)
      .pipe(take(1), takeUntil(this.destroy$))
      .subscribe(() => {
        // Recargar la lista de facturas
        this.invoiceManagementService.getAllInvoices();

        this.cd.detectChanges();
      });
  }

  marcarComoPagadaOImpagada(invoiceId: string) {
    this.invoiceDataService
      .markAsPaidOrUnpaid(invoiceId)
      .pipe(take(1), takeUntil(this.destroy$))
      .subscribe(() => {
        this.invoiceManagementService.getAllInvoices();
        this.cd.detectChanges();
      });
  }
}
