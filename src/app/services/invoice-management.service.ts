import { Injectable, OnDestroy } from '@angular/core';
import { InvoiceDataServiceService } from './invoice-data.service'; // Import the InvoiceDataService class
import { BehaviorSubject, Observable, Subject, switchMap, take, takeUntil, tap } from 'rxjs';
import { Taxes } from '../models/taxes.interface';

@Injectable({
  providedIn: 'root'
})
export class InvoiceManagementService  implements OnDestroy {

   taxes$: Observable<Taxes[]> | undefined;
   invoice$: Observable<any> | undefined;
   invoices$: Observable<any[]> | undefined;

   private destroy$: Subject<void> = new Subject<void>();
   private _taxes: BehaviorSubject<Taxes[]> = new BehaviorSubject<Taxes[]>([]);
   private _invoice: BehaviorSubject<any> = new BehaviorSubject<any>([]);
   private _invoices: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  constructor(
    private invoiceDataService: InvoiceDataServiceService

  ) {

  this.taxes$ = this._taxes.asObservable();
  this.invoice$ = this._invoice.asObservable();
  this.invoices$ = this._invoices.asObservable();



  this.invoiceDataService.getTaxes()
  .pipe(
    take(1),
    takeUntil(this.destroy$))
  .subscribe((taxes: Taxes[]) => {
    this._taxes.next(taxes);
  });






  }
  ngOnDestroy(): void {
   this.destroy$.next();
   this.destroy$.complete();
  }


  getTaxes() {
    return this._taxes.getValue()
  }


  getInvoiceById(invoiceId: string) {
    this.invoiceDataService.getInvoiceById(invoiceId).pipe(
      take(1),
      takeUntil(this.destroy$)
    ).subscribe(invoice => {

      this._invoice.next(invoice);
    });

    }


    finalizeInvoice(invoiceId: string, invoiceData: any) {
      return this.invoiceDataService.finalizeInvoice(invoiceId, invoiceData).pipe(
        takeUntil(this.destroy$),
        switchMap(() => this.invoiceDataService.getInvoiceById(invoiceId)),
        tap(invoice => {
          console.log('Finalized invoice data received in service:', invoice);
          this._invoice.next(invoice);
        })
      );
    }

    getAllInvoices() {
      return this.invoiceDataService.getAllInvoices().pipe(
        takeUntil(this.destroy$),
        take(1)

      ).subscribe(invoices => {
        this._invoices.next(invoices);
      });
    }


    getInvoice() {
      return this._invoice.getValue()
    }

    getUserInvoices() {
      this._invoices.getValue()
    }




}
