import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CorruptedDeviceComponent } from './components/corrupted.device/corrupted-device.component';
import { CreatePatientSurveyComponent } from './components/create.survey/create-patient-survey.component';
import { CreateDigitalPatientIntakeComponent } from './components/create/create-digital-patient-intake.component';
import { PatientGreetingCreationComponent } from './components/greeting/patient-greeting-creation.component';
import { MailVerificationComponent } from './components/mail.verification/mail-verification.component';
import { PatientSurveyGreetingComponent } from './components/patient.summary/greeting/patient-survey-greeting.component';
import { PreCreateDigitalPatientIntakeComponentComponent } from './components/pre.create/pre-create-digital-patient-intake-component.component';
import { PreRegisterDeviceComponent } from './components/pre.register.device/pre-register-device.component';
import { PreCreatePatientSurveyComponent } from './components/pre.survey/pre-create-patient-survey.component';
import { CreatePatientQuickIntakeSurveyComponent } from './components/pre.survey/quick.create.survey/create-patient-quick-intake-survey.component';
import { CreateQuickIntakeComponent } from './components/quick.intake/create/create-quick-intake.component';
import { PreCreateQuickIntakeComponent } from './components/quick.intake/pre-create/pre-create-quick-intake.component';
import { RegisterDeviceComponent } from './components/register.device/register-device.component';

const routes: Routes = [
  {
    path: '',
    data: {
    },
    children: [
      {
        path: 'quick/device-submission-request',
        component: CreateQuickIntakeComponent,
      },
      {
        path: 'register-request',
        component: PreRegisterDeviceComponent,
      },
      {
        path: 'register-finish',
        component: RegisterDeviceComponent,
      },
      {
        path: 'device-submission-request',
        component: PreCreateDigitalPatientIntakeComponentComponent,
      },
      {
        path: 'device-create-request',
        component: CreateDigitalPatientIntakeComponent,
      },
      {
        path: 'patient-mail-verification-request',
        component: MailVerificationComponent
      },
      {
        path: 'patient-mail-create-request',
        component: CreateDigitalPatientIntakeComponent,
      },
      {
        path: 'intake-finish',
        component: PatientGreetingCreationComponent
      },
      {
        path: 'corrupted',
        component: CorruptedDeviceComponent
      },
      {
        path: 'pre-create-survey',
        component: PreCreatePatientSurveyComponent,
      },
      {
        path: 'create-survey',
        component: CreatePatientSurveyComponent,
      },
      {
        path: 'submit-create-survey',
        component: CreatePatientSurveyComponent,
      },
      {
        path: 'survey-done',
        component: PatientSurveyGreetingComponent
      },
      {
        path: 'pre-quick-create-intake-survey',
        component: CreatePatientQuickIntakeSurveyComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatientDigitalIntakeRoutingModule { }
