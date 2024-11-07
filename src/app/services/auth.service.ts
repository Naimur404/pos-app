import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage-angular';
import { Observable, from, throwError, firstValueFrom } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ApiService } from '../core/services/api.service';

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface LoginResponse {
  status: string;
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // private API_URL = 'http://192.168.68.54:8000/api';
  private readonly TOKEN_KEY = 'token';
  private readonly USER_KEY = 'user';
  private isInitialized = false;

  constructor(
    // private http: HttpClient,
    private storage: Storage,
    private router: Router,
    private apiService: ApiService
  ) {
    this.init();
  }

  async init() {
    if (!this.isInitialized) {
      await this.storage.create();
      this.isInitialized = true;
      console.log('Storage initialized');
    }
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.apiService.post<LoginResponse>(`login`, { email, password })
      .pipe(
        tap(async response => {
          if (response.status === 'success') {
            await this.setToken(response.token);
            await this.setUser(response.user);
          }
        }),
        catchError(error => {
          console.error('Login error:', error);
          return throwError(() => error);
        })
      );
  }

  private async setToken(token: string): Promise<void> {
    try {
      await this.storage.set(this.TOKEN_KEY, token);
      console.log('Token stored successfully');
    } catch (error) {
      console.error('Error storing token:', error);
    }
  }

  private async setUser(user: User): Promise<any> {
    try {
      await this.storage.set(this.USER_KEY, JSON.stringify(user));
      console.log('User data stored successfully');
    } catch (error) {
      console.error('Error storing user data:', error);
    }
  }

  async getToken(): Promise<string | null> {
    return await this.storage.get(this.TOKEN_KEY);
  }

  getUser(): Observable<User | null> {
    return from(this.storage.get(this.USER_KEY).then((userDataString) => {
      if (userDataString) {
        try {
          // Parse only if it's a string; otherwise, return directly
          return typeof userDataString === 'string' ? JSON.parse(userDataString) : userDataString;
        } catch (e) {
          console.error('Failed to parse user data:', e);
          return null;
        }
      }
      return null;
    }));
  }



  async logout(): Promise<void> {
    try {
      console.log('Starting logout...');
      await firstValueFrom(this.apiService.post<any>('logout', {}));
      console.log('Logout successful');
      await this.storage.clear();
      await this.router.navigate(['/login']);
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
}


  isAuthenticated(): Promise<boolean> {
    return new Promise((resolve) => {
      this.getToken().then(token => {
        if (!token) {
          resolve(false);
          return;
        }

        this.apiService.post<{ status: boolean }>('verify', token)
          .subscribe({
            next: (response) => {
              resolve(response.status == true);
            },
            error: (error) => {  // Make this an async function
              console.error('Auth verification failed:', error);
              this.storage.clear();
              resolve(false);
            },
            complete: () => {
              return !!token;
            }
          });
      })
      .catch(async (error) => {  // Also make this async if needed
        console.error('Token retrieval failed:', error);
        await this.storage.clear();
        resolve(false);
      });
    });
}


}
