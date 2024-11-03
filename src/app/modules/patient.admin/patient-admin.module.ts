import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconModule } from '@coreui/icons-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PatientAdminRoutingModule } from './patient-admin-routing.module';
import { GoogleMapsModule } from '@angular/google-maps';
import {
  PatientListComponent,
  ValidationListComponent,
  RecommendationReportComponent,
  DashboardComponent,

  ClinicListComponent,
  UserCreationComponent,
  UserListComponent,
  PatientCreateComponent,
  InsuranceCompanyCreateComponent,
  InsuranceCompanyListComponent,
  UserUpdateComponent,
  UpdateClinicComponent,
  AuditComponent,
  UserAuditComponent,
  UserClinicAuditComponent,
  UserInsuranceCompanyAuditComponent,
  UserPatientAuditComponent,
  ClinicCreationComponent
} from './index';


import { PatientCommonModule } from '../common';
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
  AccordionModule,
  FooterModule,
  UtilitiesModule,
  ModalModule,

} from '@coreui/angular-pro';
import { QRCodeModule } from 'angularx-qrcode';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ChartjsModule } from '@coreui/angular-chartjs';
import { PatientCounterWidgetsComponent } from './components/dashboard/patient.counters.widgets/patient-counter-widgets.component';
import { ClinicsPatientsChartComponent } from './components/dashboard/patients.clinics.chart/clinics-patients-chart.component';
import { ListTrustDevicesComponent } from './components/trust.device/list/list-trust-devices.component';
import { GenerateRequestComponent } from './components/trust.device/generate.request/generate-request.component';
import { EditClinicLocationComponent } from './components/clinic/edit.clinic.location/edit-clinic-location.component';

@NgModule({
  declarations: [
    PatientListComponent,
    ValidationListComponent,
    RecommendationReportComponent,
    DashboardComponent,
    ClinicCreationComponent,
    ClinicListComponent,
    UserListComponent,
    UserCreationComponent,
    PatientCreateComponent,
    InsuranceCompanyCreateComponent,
    InsuranceCompanyListComponent,
    UserUpdateComponent, UpdateClinicComponent, AuditComponent, UserAuditComponent, UserClinicAuditComponent, UserInsuranceCompanyAuditComponent, UserPatientAuditComponent, PatientCounterWidgetsComponent, ClinicsPatientsChartComponent, ListTrustDevicesComponent, GenerateRequestComponent, EditClinicLocationComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    PatientAdminRoutingModule,
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
    PatientCommonModule,
    QRCodeModule,
    AccordionModule,
    ReactiveFormsModule,
    FooterModule,
    UtilitiesModule,
    ModalModule,
    ChartjsModule,
    GoogleMapsModule,
    NgxSpinnerModule.forRoot({ type: 'ball-scale-multiple' })
  ]
})
export class PatientAdminModule { }
