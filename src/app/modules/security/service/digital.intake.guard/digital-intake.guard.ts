import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { GeolocationService } from '@ng-web-apis/geolocation';
import { CookieService } from 'ngx-cookie-service';
import { catchError, delay, map, Observable, of, retryWhen, scan, switchMap, take, tap, throwError } from 'rxjs';
import { FindLocationService } from 'src/app/modules/common/services/geolocation/find-location.service';
import { TrustDeviceService } from 'src/app/modules/patient.admin/services/trust.device/trust-device.service';
import { CacheClinicService } from 'src/app/modules/patient.digital.intake/services/cache.clinic/cache-clinic.service';

@Injectable({
  providedIn: 'root'
})
export class DigitalIntakeGuard implements CanActivate {
  constructor(private router: Router, private cookieService: CookieService,
    private trustDeviceService: TrustDeviceService,
    private cacheClinicService: CacheClinicService,
    private findLocationService: FindLocationService) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
    const url = state.url;
    const clinicIdMatch: any = url.match(/clinicId=(\d+)/)
    if (clinicIdMatch !== null) {
      const clinicId = parseInt(clinicIdMatch[1], 10);
      return this.isDeviceHealty(clinicId).pipe(
        map((dd: any) => {
          return true;
        }),
        catchError((error) => {
          console.log(error)
          localStorage.setItem('device-error', JSON.stringify(error));
          this.router.navigate(['/digital-intake/corrupted']);
          return of(false);
        })
      );
    }
    else {
      return of(true);
    }
  }
  private isDeviceHealty(clinicId: number): Observable<boolean> {
    if (this.cookieService.check('device-id')) {
      const _callLocation = this.findLocationService.find()
      return _callLocation.pipe(
        map(geolocation => {
          return {
            deviceName: '',
            clinicId: clinicId,
            deviceId: this.cookieService.get('device-id'),
            geolocation: {
              accuracy: 0.0,
              latitude: geolocation.coords.latitude,
              longitude: geolocation.coords.longitude
            }
          };
        }), switchMap(deviceInformation =>
          this.trustDeviceService.checkDeviceHealty(deviceInformation)),
        catchError((error) => {
          console.log(error)
          var error: any = {
            code: 1,
            message: error.error.message
          }
          return throwError(() => error);
        })
      )

    } else {
      var error: any = {
        code: 1,
        message: 'Corrupted data,Please contact administrator to register device'
      }
      return throwError(() => error);
    }

  }
}
