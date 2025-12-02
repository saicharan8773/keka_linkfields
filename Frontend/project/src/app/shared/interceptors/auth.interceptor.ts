import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { catchError } from "rxjs";
import { throwError } from "rxjs";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();

  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(clonedRequest).pipe(
      catchError((error) => {
        if (error.status === 401) {
          // Token expired or invalid
          console.warn("Token expired or invalid (401). Logging out.");
          authService.logout();
          router.navigate(["/login"]);
        }
        return throwError(() => error);
      })
    );
  }

  return next(req);
};
