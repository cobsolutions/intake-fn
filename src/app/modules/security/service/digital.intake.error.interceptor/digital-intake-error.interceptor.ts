import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';


@Injectable()
export class DigitalIntakeErrorInterceptor implements HttpInterceptor {

  constructor(private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const isProtected = request.url.includes('/intake-service/api/digital-intake');
    if (request.url.includes('/digital-intake/')) {
      return next.handle(request).pipe(
        catchError((error: HttpErrorResponse) => {
          console.log(JSON.stringify(error))
          localStorage.setItem('device-error', JSON.stringify(error));
          this.router.navigate(['/digital-intake/corrupted']);
          return throwError(() => error);
        })
      );
    }

    // Otherwise, ignore
    return next.handle(request);
  }
}
