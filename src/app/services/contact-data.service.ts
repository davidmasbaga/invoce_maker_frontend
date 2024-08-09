import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/enviroments';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ContactDataService {



 private backendUrl = environment.baseUrl

  constructor(
    public http: HttpClient,
    private authService: AuthService)

    { }

 public user = this.authService.currentUser()
 private getAuthHeaders(): HttpHeaders {
  const token = this.user?.token
  return new HttpHeaders({
    'Authorization': token ? `Bearer ${token}` : ''
  });
}


private headers = {
  headers: this.getAuthHeaders()
}


getContacts():Observable<any[]>{
  return this.http.get<any[]>(this.backendUrl + 'clients');
}

getContactsByUserId():Observable<any[]>{
  return this.http.get<any[]>(this.backendUrl + `clients/${this.user?.id}`, this.headers);
}


addContact(contactData:any):Observable<any>{
return this.http.post<any[]>(this.backendUrl + `clients/${this.user?.id}`, contactData, this.headers);
}

deleteContact(contactId:string):Observable<any>{
  return this.http.delete<any[]>(this.backendUrl + `clients/delete/soft/${this.user?.id}/${contactId}`);

}

getUniqueContactByContactId(contactId:string):Observable<any>{

  return this.http.get<any[]>(this.backendUrl + `clients/${this.user?.id}/${contactId}`, this.headers);

}


editContact(contactId:string, contactData:any):Observable<any>{
return this.http.put<any[]>(this.backendUrl + `clients/edit/${this.user?.id}/${contactId}`, contactData, this.headers);
}

}
