import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { DigitalIntakeOTTService } from '../digital.intake.ott.service/digital-intake-ott.service';
import { Router } from '@angular/router';

@Injectable()
export class DigitalIntakeInterceptor implements HttpInterceptor {

  constructor(private digitalIntakeOTTService: DigitalIntakeOTTService, private router: Router) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const tokenId = this.digitalIntakeOTTService.getToken();
    const requester = this.digitalIntakeOTTService.getRequester();
    const isProtected = request.url.includes('/intake-service/api/digital-intake');
    if (tokenId && isProtected) {
      console.log('DigitalIntakeInterceptor ' + tokenId)
      const cloned = request.clone({
        setHeaders: {
          'X-OTT-Token': tokenId,
          'X-Requester': requester ?? ''
        }
      });
      return next.handle(cloned);
    }
    return next.handle(request);
  }
}
