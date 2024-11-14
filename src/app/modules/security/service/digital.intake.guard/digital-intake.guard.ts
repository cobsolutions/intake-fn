import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Params, Router, RouterStateSnapshot } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { catchError, map, Observable, of, switchMap, throwError } from 'rxjs';
import { FindLocationService } from 'src/app/modules/common/services/geolocation/find-location.service';
import { TrustDeviceService } from 'src/app/modules/patient.admin/services/trust.device/trust-device.service';

@Injectable({
  providedIn: 'root'
})
export class DigitalIntakeGuard implements CanActivate {
  token: string;
  clinicId: string
  constructor(private router: Router, private cookieService: CookieService,
    private trustDeviceService: TrustDeviceService,
    private findLocationService: FindLocationService,
    private route: ActivatedRoute) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
    const url = state.url;
    if (url.includes('create')) {
      this.getParameters(route.queryParams);
      return this.isDeviceHealty(this.clinicId).pipe(
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
  private isDeviceHealty(clinicId: string | undefined): Observable<boolean> {
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
          this.trustDeviceService.checkDeviceHealty(deviceInformation,this.token,this.clinicId)),
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
        message: 'Device is not register'
      }
      return throwError(() => error);
    }

  }
  // private getClinicId(queryParams: Params): string | undefined{
  //   const clinicId = queryParams['clinicId'];
  //   if (clinicId === undefined)
  //     return undefined;
  //   if (localStorage.getItem(clinicId) === null) {
  //     localStorage.setItem('clinicId', clinicId);
  //     return clinicId;
  //   } else {
  //     return localStorage.getItem(clinicId)?.toString() || '{}';
  //   }
  // }
  private getParameters(queryParams: Params) {
    this.clinicId = queryParams['clinicId'];
    this.token = queryParams['token'];
  }
}
