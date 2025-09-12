import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconModule } from '@coreui/icons-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PatientAdminRoutingModule } from './patient-admin-routing.module';
import { GoogleMapsModule } from '@angular/google-maps';
import { NgChartsModule } from 'ng2-charts';
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
  LoadingButtonModule,

} from '@coreui/angular-pro';
import { QRCodeModule } from 'angularx-qrcode';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ChartjsModule } from '@coreui/angular-chartjs';
import { PatientCounterWidgetsComponent } from './components/dashboard/patient.counters.widgets/patient-counter-widgets.component';
import { ClinicsPatientsChartComponent } from './components/dashboard/patients.clinics.chart/clinics-patients-chart.component';
import { ListTrustDevicesComponent } from './components/trust.device/list/list-trust-devices.component';
import { EditClinicLocationComponent } from './components/clinic/edit.clinic.location/edit-clinic-location.component';
import { PatientSourceBarChartComponent } from './components/dashboard/patient.source.bar.chart/patient-source-bar-chart.component';
import { PatientSourcePieChartComponent } from './components/dashboard/patient.source.pie.chart/patient-source-pie-chart.component';
import { RequestDeviceRegistrationComponent } from './components/requesters/device.registration/request-device-registration.component';
import { RequestDeviceIntakeSubmissionComponent } from './components/requesters/intake.submission/device/request-device-intake-submission.component';
import { RequestMailIntakeSubmissionComponent } from './components/requesters/intake.submission/mail/request-mail-intake-submission.component';
import { BioComponent } from './components/test.bio/bio.component';
import { CapComponent } from './components/test.bio/cap/cap.component';
import { WebcamModule } from 'ngx-webcam';
import { EditPatientProviderComponent } from './components/patient.provider.update/edit-patient-provider.component';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { ChnagesReportComponent } from './components/reports/patient.change.report/chnages-report.component';
import { PatientContactReportComponent } from './components/reports/patient.contact/patient-contact-report.component';
import { FailedPatientComponent } from './components/failed.patient/failed-patient.component';
import { PelvicSurveyComponent } from './components/survey/pelvic-survey.component';
import { SurveySubmissionComponent } from './components/survey/submission/survey-submission.component';
import { RequestDeviceSurveySubmissionComponentComponent } from './components/requesters/survey.submission/request-device-survey-submission-component.component';
import { QuickIntakeComponent } from './components/survey/quick.intake/quick-intake.component';
import { GenerateSurveyComponent } from './components/generate.survey/generate-survey.component';
import { ListSurveyComponent } from './components/list.survey/list-survey.component';
import { ShowPatientSurveyComponent } from './components/show.survey/show-patient-survey.component';

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
    UserUpdateComponent, 
    UpdateClinicComponent, 
    AuditComponent, 
    UserAuditComponent, 
    UserClinicAuditComponent, 
    UserInsuranceCompanyAuditComponent, 
    UserPatientAuditComponent, 
    PatientCounterWidgetsComponent, 
    ClinicsPatientsChartComponent, 
    ListTrustDevicesComponent, 
    EditClinicLocationComponent, 
    PatientSourceBarChartComponent, 
    PatientSourcePieChartComponent, 
    RequestDeviceRegistrationComponent, 
    RequestDeviceIntakeSubmissionComponent, 
    RequestMailIntakeSubmissionComponent, BioComponent, CapComponent, EditPatientProviderComponent, ChnagesReportComponent, PatientContactReportComponent, FailedPatientComponent, PelvicSurveyComponent, SurveySubmissionComponent, RequestDeviceSurveySubmissionComponentComponent, QuickIntakeComponent, GenerateSurveyComponent, ListSurveyComponent, ShowPatientSurveyComponent
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
    NgChartsModule,
    WebcamModule,
    AutocompleteLibModule,
    LoadingButtonModule,
    NgxSpinnerModule.forRoot({ type: 'ball-scale-multiple' })
  ]
})
export class PatientAdminModule { }
