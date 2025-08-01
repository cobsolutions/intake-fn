import { APP_INITIALIZER, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  AlertModule,
  BadgeModule,
  ButtonModule,
  CardModule,
  CollapseModule,
  GridModule,
  SharedModule,
  SmartTableModule,
  TableModule,
  FormModule,
  DatePickerModule,
  DropdownModule,
  ButtonGroupModule,
  ListGroupModule,
  TooltipModule,
  TabsModule,
  NavModule,
  DateRangePickerModule,
  TimePickerModule,
  SmartPaginationModule,
  ToastModule,
  CalloutModule,
  MultiSelectModule,
  WidgetModule,
  ProgressModule,


} from '@coreui/angular-pro';
import { FormsModule } from '@angular/forms';
import { IconModule } from '@coreui/icons-angular';
import { NgxSpinnerModule } from 'ngx-spinner';
import { initializer } from './keycloak-initializer';
import { KeycloakService } from 'keycloak-angular';
import { KcAuthServiceService } from './service/kc/kc-auth-service.service';
import { KCAuthGuardGuard } from './service/kc/kcauth-guard.guard';
import { FetshDigitalPatientIntakeUrlsService } from './service/digital.intake.urls/fetsh-digital-patient-intake-urls.service';
@NgModule({
  declarations: [
    
  ],
  imports: [
    CommonModule,
    FormsModule,
    AlertModule,
    BadgeModule,
    ButtonModule,
    CardModule,
    CollapseModule,
    GridModule,
    SharedModule,
    SmartTableModule,
    TableModule,
    FormModule,
    DatePickerModule,
    DropdownModule,
    ButtonGroupModule,
    ListGroupModule,
    TooltipModule,
    TabsModule,
    NavModule,
    DateRangePickerModule,
    TimePickerModule,
    IconModule,
    SmartPaginationModule,
    ToastModule,
    CalloutModule,
    MultiSelectModule,
    WidgetModule,
    ProgressModule,
    NgxSpinnerModule.forRoot({ type: 'ball-scale-multiple' })
  ],
  providers: [
    {
        provide: APP_INITIALIZER,
        useFactory: initializer,
        multi: true,
        deps: [KeycloakService,FetshDigitalPatientIntakeUrlsService,KcAuthServiceService]
    },
    KeycloakService,
    KcAuthServiceService,
    KCAuthGuardGuard
  ]
})
export class SecurityModule { }
