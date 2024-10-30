import { Injectable } from '@angular/core';
import { GeolocationService } from '@ng-web-apis/geolocation';
import { catchError, debounceTime, filter, forkJoin, from, map, Observable, retry, switchMap, take, tap, throwError, timeout } from 'rxjs';
import * as FingerprintJS from '@fingerprintjs/fingerprintjs';
import { HttpErrorResponse } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class FingerprintService {

  constructor(private geolocation$: GeolocationService) { }
  public get(): Observable<any[]> {
    const _callLocation = this.getLocation();
    const _callDeviceId = this.getDeviceId();
    return forkJoin([_callLocation,_callDeviceId])
  }

  private getLocation(): Observable<any> {    
    return this.geolocation$.pipe(
      timeout(5000),
      take(1),
      catchError(this.handleHttpError));
  }
  private handleHttpError(error: HttpErrorResponse) {
    console.log(error)
    return throwError(() => error);
  }
  private getDeviceId(): Observable<any> {
    return from(FingerprintJS.load()).pipe(

      switchMap(res => from(res.get())),
      map(result => result.visitorId)
    )
  }
}
