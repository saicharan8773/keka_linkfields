import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, tap } from "rxjs";
import {
  LoginRequest,
  SignupRequest,
  AuthResponse,
} from "../models/auth.model";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  // Backend exposes auth endpoints at /auth (not /api/auth) — adjust base to match backend
  private readonly AUTH_API = "https://localhost:7225/auth";
  private readonly TOKEN_KEY = "authToken";

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<AuthResponse> {
    const loginData: LoginRequest = { email, password };

    return this.http
      .post<AuthResponse>(`${this.AUTH_API}/login`, loginData)
      .pipe(
        tap((response) => {
          if (response.accessToken) {
            localStorage.setItem(this.TOKEN_KEY, response.accessToken);
          }
        })
      );
  }

  signup(userData: SignupRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.AUTH_API}/register`, userData)
      .pipe(
        tap((response) => {
          if (response.accessToken) {
            localStorage.setItem(this.TOKEN_KEY, response.accessToken);
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.TOKEN_KEY);
  }

  getToken(): string | null {
    return (
      localStorage.getItem(this.TOKEN_KEY) ||
      sessionStorage.getItem(this.TOKEN_KEY)
    );
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getUserRole(): string | null {
    const payload = this.decodeTokenPayload();
    if (!payload) {
      return null;
    }
    return (
      payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
      payload["role"] ||
      null
    );
  }

  hasRole(roles: string[]): boolean {
    const role = this.getUserRole();
    return !!role && roles.includes(role);
  }

  getUserId(): string {
    const token = this.getToken();
    if (!token) return "";
    try {
      const payload = token.split(".")[1];
      const decoded = JSON.parse(atob(payload));
      return (
        decoded.sub ||
        decoded[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ] ||
        ""
      );
    } catch {
      return "";
    }
  }

  private decodeTokenPayload(): Record<string, any> | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }

    try {
      const [, payload] = token.split(".");
      if (!payload) {
        return null;
      }
      const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
      const decodedPayload = atob(normalized);
      return JSON.parse(decodedPayload);
    } catch {
      return null;
    }
  }
}
