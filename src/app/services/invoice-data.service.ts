import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InvoiceDataServiceService {

  private conceptsSubject = new BehaviorSubject<any[]>([]);
  concepts$ = this.conceptsSubject.asObservable();


  constructor( public http: HttpClient, ) {

  }

  getTaxes():Observable<any[]>{
    return this.http.get<any[]>('http://localhost:3000/taxes');
  }




  // addConcept(concept: any) {
  //   const currentConcepts = this.conceptsSubject.getValue();
  //   this.conceptsSubject.next([...currentConcepts, concept]);
  // }

  // updateConcept(index: number, concept: any) {
  //   const currentConcepts = this.conceptsSubject.getValue();
  //   currentConcepts[index] = concept;
  //   this.conceptsSubject.next([...currentConcepts]);
  // }

  // removeConcept(index: number) {
  //   const currentConcepts = this.conceptsSubject.getValue();
  //   currentConcepts.splice(index, 1);
  //   this.conceptsSubject.next([...currentConcepts]);
  // }

  // getConcepts() {
  //   return this.conceptsSubject.getValue();
  // }

  // clearConcepts() {
  //   this.conceptsSubject.next([]);
  // }





}
