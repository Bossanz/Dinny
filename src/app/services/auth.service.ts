import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  public apiUrl = 'https://node-for-project-app-flutter.onrender.com';
  
  private tokenSubject = new BehaviorSubject<string | null>(localStorage.getItem('token'));
  token$ = this.tokenSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  async login(email: string, password: string): Promise<void> {
    const res = await lastValueFrom(
      this.http.post<{ token: string }>(`${this.apiUrl}/admin/login`, { email, password })
    );
    localStorage.setItem('token', res.token);
    this.tokenSubject.next(res.token);
    this.router.navigate(['/dashboard/home']); // redirect หลัง login
  }

  logout() {
    localStorage.removeItem('token');
    this.tokenSubject.next(null);
    this.router.navigate(['/login']); // redirect หลัง logout
  }

  isLoggedIn(): boolean {
    return !!this.tokenSubject.value;
  }

  getToken(): string | null {
    return this.tokenSubject.value;
  }
}
