import { Injectable, OnDestroy } from '@angular/core';
import { InvoiceDataServiceService } from './invoice-data.service'; // Import the InvoiceDataService class
import { BehaviorSubject, Observable, Subject, take, takeUntil } from 'rxjs';
import { Taxes } from '../models/taxes.interface';

@Injectable({
  providedIn: 'root'
})
export class InvoiceManagementService  implements OnDestroy {

   taxes$: Observable<Taxes[]> | undefined;

   private destroy$: Subject<void> = new Subject<void>();
   private _taxes: BehaviorSubject<Taxes[]> = new BehaviorSubject<Taxes[]>([]);

  constructor(
    private invoiceDataService: InvoiceDataServiceService

  ) {

  this.taxes$ = this._taxes.asObservable();

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



}
