import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IconModule, IconSetService } from '@coreui/icons-angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import {
  PerfectScrollbarConfigInterface, PerfectScrollbarModule,
  PERFECT_SCROLLBAR_CONFIG
} from 'ngx-perfect-scrollbar';

import {
  AvatarModule,
  BadgeModule,
  BreadcrumbModule,
  ButtonGroupModule,
  ButtonModule,
  CardModule,
  DateRangePickerModule,
  DropdownModule,
  FooterModule,
  FormModule,
  GridModule,
  HeaderModule,
  ListGroupModule,
  NavModule,
  ProgressModule,
  SharedModule,
  SidebarModule,
  TabsModule,
  UtilitiesModule
} from '@coreui/angular-pro';


import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { POSITION_OPTIONS } from '@ng-web-apis/geolocation';
import { CookieService } from 'ngx-cookie-service';
import { ToastrModule } from 'ngx-toastr';
import {
  AdminHeaderComponent, DefaultAdminLayoutComponent, DefaultFooterComponent, DefaultHeaderComponent, DefaultLayoutComponent
} from './core';
import { ScannerlayoutComponent } from './core/scannerlayout/scannerlayout.component';
import { PatientListService } from './modules/patient.admin/services/patient-list.service';
import { PatientService } from './modules/patient.questionnaire/service/patient.service';
import { SecurityModule } from './modules/security';
import { AuthInterceptor } from './modules/security/service/auth.interceptor';
import { PelvicSurveyComponent } from './modules/patient.survey/pelvic/pelvic-survey.component';
import { DigitalIntakeInterceptor } from './modules/security/service/digital.intake.interceptor/digital-intake.interceptor';
import { DigitalIntakeErrorInterceptor } from './modules/security/service/digital.intake.error.interceptor/digital-intake-error.interceptor';





const APP_CONTAINERS = [
  DefaultHeaderComponent,
  DefaultFooterComponent,
  DefaultLayoutComponent
];

const ADMIN_APP_CONTAINERS = [
  DefaultAdminLayoutComponent,
  AdminHeaderComponent
]
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
};
@NgModule({
  declarations: [AppComponent, ...APP_CONTAINERS, ...ADMIN_APP_CONTAINERS, ScannerlayoutComponent, PelvicSurveyComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    PerfectScrollbarModule,
    AppRoutingModule,
    AvatarModule,
    BadgeModule,
    BreadcrumbModule,
    ButtonGroupModule,
    ButtonModule,
    CardModule,
    DropdownModule,
    FooterModule,
    FormModule,
    GridModule,
    HeaderModule,
    ListGroupModule,
    NavModule,
    ProgressModule,
    SharedModule,
    SidebarModule,
    TabsModule,
    UtilitiesModule,
    ReactiveFormsModule,
    IconModule,
    BrowserAnimationsModule,
    FormsModule,
    DateRangePickerModule,
    ToastrModule.forRoot({
      timeOut: 10000,
      closeButton: true,
      progressBar: true,
      progressAnimation:'decreasing'
    }),
    SecurityModule
  ],
  providers: [
    [CookieService],
    {
      provide: LocationStrategy,
      useClass: PathLocationStrategy,
    },
    IconSetService,
    Title,
    PatientService,
    PatientListService,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: DigitalIntakeInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: DigitalIntakeErrorInterceptor, multi: true },
    {
      provide: POSITION_OPTIONS,
      useValue: {enableHighAccuracy: true, timeout: 3000, maximumAge: 1000},
  },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
