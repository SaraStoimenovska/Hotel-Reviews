import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from './shared/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  token: string;
  email: string;
  id: string;
  isAuthenticated: BehaviorSubject<boolean>;

  constructor(private http: HttpClient, private router: Router) {
    this.isAuthenticated = new BehaviorSubject(false);

    if (localStorage.getItem('Token')) {
      // logged in so return true
      this.token = localStorage.getItem('Token');
      this.email = localStorage.getItem('Email');
      this.id = localStorage.getItem('Id');
      this.isAuthenticated.next(true);
    }
  }

  saveToken(token: string): void {
    localStorage.setItem('Token', token);
    this.token = token;
  }

  getToken(): string {
    if (!this.token) {
      this.token = localStorage.getItem('Token');
    }
    return this.token;
  }

  saveUserEmail(email: string): void {
    localStorage.setItem('Email', email);
    this.email = email;
  }

  getUserEmail(): string {
    if (!this.email) {
      this.email = localStorage.getItem('Email');
    }
    return this.email;
  }

  saveUserId(id: string): void {
    localStorage.setItem('Id', id);
    this.id = id;
  }

  getUserId(): number {
    if (!this.id) {
      this.id = localStorage.getItem('Id');
    }
    return parseInt(this.id);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (token) {
      this.isAuthenticated = new BehaviorSubject(true);
      return true;
    }
    return false;
  }

  register(user: User): Observable<any> {
    return this.http.post(`${environment.apiUrl}/register/`, user, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }

  public login(user: User): Observable<any> {
    return this.http
      .post(`${environment.apiUrl}/api-token-auth/`, user, {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      })
      .pipe(
        map((response: any) => {
          if (response.token) {
            this.isAuthenticated.next(true);
            this.saveToken(response.token);
            this.saveUserEmail(response.email);
            this.saveUserId(response.user_id);
          }
        })
      );
  }

  public logout(): void {
    this.token = '';
    this.email = '';
    this.id = '';
    localStorage.removeItem('Token');
    localStorage.removeItem('Email');
    localStorage.removeItem('Id');
    this.isAuthenticated.next(false);
    this.router.navigate(['/login']);
  }
}
