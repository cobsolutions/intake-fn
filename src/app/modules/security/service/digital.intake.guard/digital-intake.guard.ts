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
    if (url.includes('create') || url.includes('register')) {
      //Catch device-id and clear it
      //Device id will bet set as asecure HTTP cookie from back-end side 
      var deviceId = undefined
      if (this.cookieService.check('device-id')) {
        deviceId = this.cookieService.get('device-id');
        this.cookieService.delete('device-id')
      }
      return this.digitalIntakeService.checkDevice(route.queryParams['token'], deviceId).pipe(
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
    if (url.includes('submit')) {
      return this.digitalIntakeService.validateMail(route.queryParams['token']).pipe(
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

    return of(true);

  }
}
