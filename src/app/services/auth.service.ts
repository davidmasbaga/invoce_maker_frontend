import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, throwError, tap, of } from 'rxjs';
import { environment } from '../../enviroments/enviroments';
import { AuthStatus, LoginResponse, User } from '../auth/interfaces';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private backendUrl = environment.baseUrl;
  private http = inject(HttpClient);

  private _currentUser = signal<User | null>(null);
  private _authStatus = signal<AuthStatus>(AuthStatus.checking);

  public currentUser = computed(() => this._currentUser());
  public authStatus = computed(() => this._authStatus());

  login(email: string, password: string): Observable<boolean> {
    const url = `${this.backendUrl}auth`;
    const body = { email, password };

    return this.http.post<LoginResponse>(url, body).pipe(
      tap(({ user }) => {

        this._currentUser.set(user);
        this._authStatus.set(AuthStatus.authenticated);

        if (user.token) {
          localStorage.setItem('token', user.token);
          localStorage.setItem('userId', user.id);
        }

      }),
      map(() => true),
      catchError((error) => {
        this._authStatus.set(AuthStatus.notAuthenticated);
        return throwError(() => error);
      })
    );
  }


  checkAuthStatus(): Observable<boolean> {
    const url = `${this.backendUrl}auth/check-token`;
    const token = localStorage.getItem('token');

    if (!token) {
      this._authStatus.set(AuthStatus.notAuthenticated);
      return of(false);
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<{ id: string; token: string }>(url, { headers }).pipe(
      tap(response => {
        if (response && response.id && response.token) {

          this._currentUser.set({ id: response.id, token: response.token } as User);
          this._authStatus.set(AuthStatus.authenticated);
          localStorage.setItem('userId', response.id);

        } else {
          this._authStatus.set(AuthStatus.notAuthenticated);
        }
      }),
      map(response => !!response.id),
      catchError(() => {
        this._authStatus.set(AuthStatus.notAuthenticated);
        return of(false);
      })
    );
  }


  



  }


