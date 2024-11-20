import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CorruptedDeviceComponent } from './components/corrupted.device/corrupted-device.component';
import { CreateDigitalPatientIntakeComponent } from './components/create/create-digital-patient-intake.component';
import { PatientGreetingCreationComponent } from './components/greeting/patient-greeting-creation.component';
import { MailVerificationComponent } from './components/mail.verification/mail-verification.component';

const routes: Routes = [
  {
    path: '',
    data: {
    },
    children: [
      {
        path: 'create',
        component: CreateDigitalPatientIntakeComponent,
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
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatientDigitalIntakeRoutingModule { }
