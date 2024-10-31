import { Injectable } from '@angular/core';
import { GeolocationService } from '@ng-web-apis/geolocation';
import { catchError, debounceTime, delay, filter, forkJoin, from, map, Observable, of, retry, retryWhen, scan, switchMap, take, tap, throwError, timeout } from 'rxjs';
import * as FingerprintJS from '@fingerprintjs/fingerprintjs';
import { HttpErrorResponse } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class FingerprintService {

  constructor(private geolocation$: GeolocationService) { }
  public get(): Observable<any[]> {
    const _callLocation = this.getLocation().pipe(
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
    const _callDeviceId = this.getDeviceId();
    return forkJoin([_callLocation,_callDeviceId])
  }

  private getLocation(): Observable<any> {    
    return this.geolocation$.pipe(
      take(1),
      catchError(this.handleHttpError));
  }
  private handleHttpError(error: HttpErrorResponse) {
    return throwError(() => error);
  }
  private getDeviceId(): Observable<any> {
    return from(FingerprintJS.load()).pipe(

      switchMap(res => from(res.get())),
      map(result => result.visitorId)
    )
  }
}
