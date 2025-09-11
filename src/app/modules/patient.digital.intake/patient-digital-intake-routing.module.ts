import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CorruptedDeviceComponent } from './components/corrupted.device/corrupted-device.component';
import { CreatePatientSurveyComponent } from './components/create.survey/create-patient-survey.component';
import { CreateDigitalPatientIntakeComponent } from './components/create/create-digital-patient-intake.component';
import { PatientGreetingCreationComponent } from './components/greeting/patient-greeting-creation.component';
import { MailVerificationComponent } from './components/mail.verification/mail-verification.component';
import { CreateDigitalPatientQuickIntakeSurveyComponent } from './components/patient.quick/create.quick.survey/create-digital-patient-quick-intake-survey.component';
import { PatientSurveyGreetingComponent } from './components/patient.summary/greeting/patient-survey-greeting.component';
import { PreCreateDigitalPatientIntakeComponentComponent } from './components/pre.create/pre-create-digital-patient-intake-component.component';
import { PreRegisterDeviceComponent } from './components/pre.register.device/pre-register-device.component';
import { PreCreatePatientSurveyComponent } from './components/pre.survey/pre-create-patient-survey.component';
import { CreatePatientQuickIntakeSurveyComponent } from './components/pre.survey/quick.create.survey/create-patient-quick-intake-survey.component';
import { RegisterDeviceComponent } from './components/register.device/register-device.component';

const routes: Routes = [
  {
    path: '',
    data: {
    },
    children: [
      {
        path: 'pre-create',
        component: PreCreateDigitalPatientIntakeComponentComponent,
      },
      {
        path: 'create',
        component: CreateDigitalPatientIntakeComponent,
      },
      {
        path: 'pre-register',
        component: PreRegisterDeviceComponent,
      },
      {
        path: 'register',
        component: RegisterDeviceComponent,
      },
      {
        path: 'submit',
        component: CreateDigitalPatientIntakeComponent,
      },
      {
        path: 'verfiy/mail',
        component: MailVerificationComponent
      },
      {
        path: 'done',
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
      },
      {
        path: 'quick-create-intake-survey',
        component: CreateDigitalPatientQuickIntakeSurveyComponent,
      },
      {
        path: 'submit-quick-create-intake-survey',
        component: CreateDigitalPatientQuickIntakeSurveyComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatientDigitalIntakeRoutingModule { }
