import {
  HttpEvent, HttpHandler, HttpInterceptor, HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { catchError, finalize, from, mergeMap, Observable } from 'rxjs';
import { FetshDigitalPatientIntakeUrlsService } from './digital.intake.urls/fetsh-digital-patient-intake-urls.service';
import { KcAuthServiceService } from './kc/kc-auth-service.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private kcAuthServiceService: KcAuthServiceService, private keycloakService: KeycloakService
    , private spinner: NgxSpinnerService
    , private fetshUrls: FetshDigitalPatientIntakeUrlsService
    , private toastrService: ToastrService) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.spinner.show();
    if (request.url.includes('/authentication')) {
      return next.handle(request);
    }
    if (request.url.includes('/trusted-device/register')) {
      return next.handle(request);
    }
    return from(this.kcAuthServiceService.getToken())
      .pipe(
        mergeMap(token => {
          var _token = this.getToken(token);
          request = request.clone({
            setHeaders: { Authorization: `Bearer ${_token}` }
          });
          return next.handle(request);
        }
        ),
        finalize(() => {
          this.spinner.hide();
        }),
        catchError(error => {
          if (error.status === 401) {
            console.log('token is expired 401');
            console.log('Error:' + JSON.stringify(error.error));
            this.kcAuthServiceService.logout();
          }
          if (error.error.errorCode === 'UNAUTHORIZED') {
            console.log('token is expired UNAUTHORIZED');
            console.log('Error:' + JSON.stringify(error.error));
            this.kcAuthServiceService.logout();
          } else {
            if (request.url === '/intake-service/api/patient/create') {
              this.toastrService.error('Error during creating patient.');
              this.scrollUp()
            }
            console.log('other error , please contact the administrator..!! ErrorCode :' + error.error.errorCode);
            console.log('Error:' + JSON.stringify(error.error));
            throw error;
          }
          return [];
        }))
  }
  private scrollUp() {
    (function smoothscroll() {
      var currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
      if (currentScroll > 0) {
        window.scrollTo(0, 0);
      }
    })();
  }
  private getToken(token: string): string | null {
    var return_token: string
    if (!this.fetshUrls.isDigitalIntakeURLS()) {
      if (localStorage.getItem('access-token') === null) {
        localStorage.setItem('access-token', token)
      } else {
        localStorage.getItem('access-token')
      }
      return localStorage.getItem('access-token');
    } else {
      if (localStorage.getItem('digital-access-token') === null) {
        localStorage.setItem('digital-access-token', token)
      } else {
        localStorage.setItem('digital-access-token', token)
      }
      return localStorage.getItem('digital-access-token')
    }
  }
}
