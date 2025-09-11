import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CorruptedDeviceComponent } from './components/corrupted.device/corrupted-device.component';
import { CreateDigitalPatientIntakeComponent } from './components/create/create-digital-patient-intake.component';
import { PatientGreetingCreationComponent } from './components/greeting/patient-greeting-creation.component';
import { MailVerificationComponent } from './components/mail.verification/mail-verification.component';
import { PreCreateDigitalPatientIntakeComponentComponent } from './components/pre.create/pre-create-digital-patient-intake-component.component';
import { PreRegisterDeviceComponent } from './components/pre.register.device/pre-register-device.component';
import { PreCreatePatientSurveyComponent } from './components/pre.survey/pre-create-patient-survey.component';
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
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatientDigitalIntakeRoutingModule { }
