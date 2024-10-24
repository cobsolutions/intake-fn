import { Injectable } from '@angular/core';
import { GeolocationService } from '@ng-web-apis/geolocation';
import { filter, forkJoin, from, map, Observable, switchMap, take } from 'rxjs';
import * as FingerprintJS from '@fingerprintjs/fingerprintjs';
@Injectable({
  providedIn: 'root'
})
export class FingerprintService {

  constructor(private readonly geolocation$: GeolocationService) { }
  public get():Observable<any[]>{
    const _callLocation = this.getLocation();
    const _callDeviceId = this.getDeviceId();
    return forkJoin([_callLocation, _callDeviceId])
  }

  private getLocation():Observable<any>{
    return this.geolocation$.pipe(take(1));
  }
  private getDeviceId() :Observable<any>{    
    return from(FingerprintJS.load()).pipe(
      switchMap(res=>from(res.get())),
      map(result=>result.visitorId)
    )
  }
}
