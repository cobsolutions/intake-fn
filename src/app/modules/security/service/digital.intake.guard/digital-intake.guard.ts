import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { catchError, map, Observable, of } from 'rxjs';
import { DigitalIntakeService } from 'src/app/modules/patient.digital.intake/services/digitalIntake/digital-intake.service';

@Injectable({
  providedIn: 'root'
})
export class DigitalIntakeGuard implements CanActivate {
  token: string;
  clinicId: string
  constructor(private router: Router, private cookieService: CookieService,
    private digitalIntakeService: DigitalIntakeService,
    private route: ActivatedRoute,) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
    const url = state.url;
    if (url.includes('create')) {
      return this.digitalIntakeService.cacheTrustDevice(route.queryParams['token'], this.cookieService.get('device-id')).pipe(
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
    else if (url.includes('verfiy/mail')){
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
}
