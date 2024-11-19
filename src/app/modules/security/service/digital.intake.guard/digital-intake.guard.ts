import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { DigitalIntakeService } from 'src/app/modules/patient.digital.intake/services/digitalIntake/digital-intake.service';
import { v5 as uuidv5 } from 'uuid';
@Injectable({
  providedIn: 'root'
})
export class DigitalIntakeGuard implements CanActivate {
  token: string;
  clinicId: string
  constructor(private router: Router, private cookieService: CookieService,
    private digitalIntakeService: DigitalIntakeService) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
    const url = state.url;
    if (url.includes('create')) {
      if (this.checkInUse(this.cookieService.get('device-id'))) {
        return of(true);
      }
      return this.digitalIntakeService.cacheTrustDevice(route.queryParams['token'], this.cookieService.get('device-id')).pipe(
        map((dd: any) => {
          localStorage.setItem('used', this.generateUsedUUID(this.cookieService.get('device-id')))
          return true;
        }),
        catchError((error) => {
          localStorage.setItem('device-error', JSON.stringify(error));
          this.router.navigate(['/digital-intake/corrupted']);
          return of(false);
        })
      );
    }
    else if (url.includes('verfiy/mail')) {
      return this.digitalIntakeService.cacheVerifiedMail(route.queryParams['token']).pipe(
        map((dd: any) => {
          return true;
        }),
        catchError((error) => {
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
  private generateUsedUUID(deviceId: string): string {
    const NAMESPACE = 'e7e10b6e-cf8c-4a4f-9f20-10bf2db354cc';
    return uuidv5(deviceId, NAMESPACE);
  }
  private checkInUse(deviceId: string) {
    const isuseUUID = localStorage.getItem('used');
    if (isuseUUID === undefined)
      return false
    else {
      if (isuseUUID === this.generateUsedUUID(deviceId))
        return true
      else {
        throwError(() => new Error());
      }

    }
  }
}
