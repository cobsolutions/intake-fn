import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PatientDigitalIntakeRoutingModule } from './patient-digital-intake-routing.module';
import { CreateDigitalPatientIntakeComponent } from './components/create/create-digital-patient-intake.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatStepperModule } from '@angular/material/stepper';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AvatarModule, BadgeModule, BreadcrumbModule, ButtonGroupModule, ButtonModule, CardModule, DropdownModule, FooterModule, FormModule, GridModule, HeaderModule, ListGroupModule, NavModule, ProgressModule, SharedModule, SidebarModule, TabsModule, UtilitiesModule, DateRangePickerModule, AlertModule, MultiSelectModule, DatePickerModule, AccordionModule, CalloutModule, PopoverModule, LoadingButtonModule } from '@coreui/angular-pro';
import { IconModule } from '@coreui/icons-angular';
import { PatientBasicComponent } from './components/patient.basic/patient-basic.component';
import { PatientCommonModule } from '../common';
import { PatientAddressComponent } from './components/patient.address/patient-address.component';
import { PatientMedicalComponent } from './components/patient.medical/patient-medical.component';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { PatientMedicalHistoryComponent } from './components/patient.medical.history/patient-medical-history.component';
import { PatientInsuranceComponent } from './components/patient.insurance/patient-insurance.component';
import { PatientDocumentComponent } from './components/patient.document/patient-document.component';
import { PatientAgreementComponent } from './components/patient.agreement/patient-agreement.component';
import { PatientSignatureComponent } from './components/patient.signature/patient-signature.component';
import { PatientSummaryComponent } from './components/patient.summary/patient-summary.component';
import { PatientGreetingCreationComponent } from './components/greeting/patient-greeting-creation.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { CorruptedDeviceComponent } from './components/corrupted.device/corrupted-device.component';
import { PatientIdentityVerificationComponent } from './components/patinet.identity.verification/patient-identity-verification.component';
import { PatientConsentComponent } from './components/patient.consent/patient-consent.component';
import { MailVerificationComponent } from './components/mail.verification/mail-verification.component';
import { RegisterDeviceComponent } from './components/register.device/register-device.component';
import { PreRegisterDeviceComponent } from './components/pre.register.device/pre-register-device.component';
import { PreCreateDigitalPatientIntakeComponentComponent } from './components/pre.create/pre-create-digital-patient-intake-component.component';
import { PatientBiometricIdentificationComponent } from './components/patient.biometric.identification/patient-biometric-identification.component';
import { WebcamModule } from 'ngx-webcam';


const COREUI_MODULES = [
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
  IconModule,
  DateRangePickerModule,
  AlertModule,
  MultiSelectModule,
  DatePickerModule,
  CalloutModule,
  PopoverModule,
  LoadingButtonModule
]
@NgModule({
  declarations: [
    CreateDigitalPatientIntakeComponent,
    PatientBasicComponent,
    PatientAddressComponent,
    PatientMedicalComponent,
    PatientMedicalHistoryComponent,
    PatientInsuranceComponent,
    PatientDocumentComponent,
    PatientAgreementComponent,
    PatientSignatureComponent,
    PatientSummaryComponent,
    PatientGreetingCreationComponent,
    CorruptedDeviceComponent,
    PatientIdentityVerificationComponent,
    PatientConsentComponent,
    MailVerificationComponent,
    RegisterDeviceComponent,
    PreRegisterDeviceComponent,
    PreCreateDigitalPatientIntakeComponentComponent,
    PatientBiometricIdentificationComponent,
  ],
  imports: [
    CommonModule,
    PatientDigitalIntakeRoutingModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    PatientCommonModule,
    NgxSpinnerModule.forRoot({ type: 'ball-scale-multiple' }),
    ...COREUI_MODULES,
    AccordionModule,
    AutocompleteLibModule,
    WebcamModule,
    NgMultiSelectDropDownModule.forRoot()
  ],
})
export class PatientDigitalIntakeModule { }
