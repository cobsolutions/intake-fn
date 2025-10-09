import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable, of } from 'rxjs';
import { DigitalIntakeOTTService } from '../digital.intake.ott.service/digital-intake-ott.service';
@Injectable({
  providedIn: 'root'
})
export class DigitalIntakeGuard implements CanActivate {
  token: string;
  clinicId: string
  constructor(private router: Router, private cookieService: CookieService,
    private digitalIntakeOTTService: DigitalIntakeOTTService) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
    const url = state.url;
    if (url.includes('/digital-intake/corrupted'))
      return of(true);
    var tokenId: string = route.queryParams['token-id'];
    if (tokenId === undefined || tokenId.length === 0) {
      console.log('tokenId  is empty')
      this.router.navigate(['/digital-intake/corrupted']);
      return of(false);
    }
    this.digitalIntakeOTTService.setToken(tokenId)
    var requester: string | null = this.getRequester(url);
    console.log('requester ' + requester)
    this.digitalIntakeOTTService.setRequester(requester)
    return of(true);
  }

  getRequester(url: string): string | null {
    const path = url.split('?')[0];
    const lastSegment = path.substring(path.lastIndexOf('/') + 1);

    const match = lastSegment.match(/^(.+)-request$/);
    const typePart = match ? match[1] : '';
    switch (typePart) {
      case 'device-submission':
      case 'device-create':
        return 'Device_Submission';

      case 'patient-mail-create':
      case 'patient-mail-verification':
        return 'Mail_Submission';

      case 'patient-sms-create':
      case 'patient-sms-verification':
        return 'SMS_Submission';

      case 'register':
        return 'Registration';

      default:
        return null;
    }
  }
}
