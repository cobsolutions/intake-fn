import {
  HttpEvent, HttpHandler, HttpInterceptor, HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { catchError, finalize, from, map, mergeMap, Observable } from 'rxjs';
import { FetshDigitalPatientIntakeUrlsService } from './digital.intake.urls/fetsh-digital-patient-intake-urls.service';
import { KcAuthServiceService } from './kc/kc-auth-service.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private kcAuthServiceService: KcAuthServiceService, private keycloakService: KeycloakService
    , private spinner: NgxSpinnerService
    , private fetshUrls: FetshDigitalPatientIntakeUrlsService
    , private toastrService: ToastrService,
    private router: Router) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log(this.router.routerState.snapshot.url)
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
          request = request.clone({
            setHeaders: { Authorization: `Bearer ${token}` }
          });
          return next.handle(request);
        }
        ),
        finalize(() => {
          this.spinner.hide();
        }),
        catchError(error => {
          console.log(error)
          if (error.status === 401) {
            this.kcAuthServiceService.logout();
          }
          if (error.error.errorCode === 'UNAUTHORIZED') {
            this.kcAuthServiceService.logout();
          }
          else {
            this.scrollUp()
            this.toastrService.error('Error during');
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
}
