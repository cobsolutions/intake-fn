import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GeolocationService } from '@ng-web-apis/geolocation';
import { catchError, delay, Observable, of, retryWhen, scan, take, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FindLocationService {

  constructor(private geolocation$: GeolocationService) { }

  find(): Observable<any> {
    return this.getLocation().pipe(
      retryWhen((errors) =>
        errors.pipe(
          scan((retryCount, error) => {
            if (retryCount >= 2) {
              throw error;
            }
            console.warn(`Retrying... (${retryCount + 1})`);
            return retryCount + 1;
          }, 0),
          delay(2000) // Delay between retries
        )
      ),
      catchError((error) => {
        console.error('Location retrieval failed:', error);
        return of(undefined); // Return undefined on failure
      })
    );
  }

  private getLocation(): Observable<any> {
    return this.geolocation$.pipe(
      take(1),
      catchError(this.handleHttpError));
  }
  private handleHttpError(error: HttpErrorResponse) {
    return throwError(() => error);
  }
}
