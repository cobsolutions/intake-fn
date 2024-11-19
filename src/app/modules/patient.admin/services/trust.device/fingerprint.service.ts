import { Injectable } from '@angular/core';
import { GeolocationService } from '@ng-web-apis/geolocation';
import { catchError, debounceTime, delay, filter, forkJoin, from, map, Observable, of, retry, retryWhen, scan, switchMap, take, tap, throwError, timeout } from 'rxjs';
import * as FingerprintJS from '@fingerprintjs/fingerprintjs';
import { HttpErrorResponse } from '@angular/common/http';
import { FindLocationService } from 'src/app/modules/common/services/geolocation/find-location.service';
@Injectable({
  providedIn: 'root'
})
export class FingerprintService {

  constructor(private findLocationService:FindLocationService) { }
  public get(): Observable<any[]> {
    const _callLocation = this.findLocationService.find()
    const _callDeviceId = this.getDeviceId();
    return forkJoin([_callLocation,_callDeviceId])
  }
  public getDeviceId(): Observable<any> {
    return from(FingerprintJS.load()).pipe(

      switchMap(res => from(res.get())),
      map(result => result.visitorId)
    )
  }
}
