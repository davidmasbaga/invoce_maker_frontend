import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../enviroments/enviroments';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class InvoiceDataServiceService {

  private conceptsSubject = new BehaviorSubject<any[]>([]);
  concepts$ = this.conceptsSubject.asObservable();


  constructor( public http: HttpClient,
    private authService: AuthService) {

  }

  public user = this.authService.currentUser()

  getTaxes():Observable<any[]>{
    return this.http.get<any[]>(`${environment.baseUrl}taxes`);
  }



  createDraftInvoice(): Observable<{ invoiceId: string }> {
    return this.http.post<{ invoiceId: string }>(`${environment.baseUrl}invoices/create-draft/${this.user?.id}`, {});
  }

  finalizeInvoice(invoiceId: string, invoiceData: any): Observable<{ invoiceId: string }> {
    if (!this.user?.id) {
      console.error('User ID is missing');
    }


    return this.http.put<{ invoiceId: string }>(
      `${environment.baseUrl}invoices/finalize/${this.user?.id}/${invoiceId}`,
      invoiceData
    );
  }


  getInvoiceById(invoiceId: string): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}invoices/${this.user?.id}/${invoiceId}`);
  }


  getAllInvoices(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.baseUrl}invoices/${this.user?.id}`);
  }


  deleteInvoice(invoiceId: string): Observable<any> {
    return this.http.delete<any>(`${environment.baseUrl}invoices/delete/${this.user?.id}/${invoiceId}`);
  }


  calculateConcept(concept: any): Observable<any> {
    return this.http.post<any>(`${environment.baseUrl}invoices/calculate-concept/${this.user?.id}/`, concept);
  }

  calculateTotals(concepts: any): Observable<any> {
    return this.http.post<any>(`${environment.baseUrl}invoices/calculate-totals/${this.user?.id}/`, concepts);
  }

  markAsPaidOrUnpaid(invoiceId: string): Observable<any> {
    return this.http.patch<any>(`${environment.baseUrl}invoices/markaspaidorunpaid/${this.user?.id}/${invoiceId}`, null);
  }

}
