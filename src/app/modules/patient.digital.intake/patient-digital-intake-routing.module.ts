import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CorruptedDeviceComponent } from './components/corrupted.device/corrupted-device.component';
import { CreateDigitalPatientIntakeComponent } from './components/create/create-digital-patient-intake.component';
import { PatientGreetingCreationComponent } from './components/greeting/patient-greeting-creation.component';

const routes: Routes = [
  {
    path: '',
    data: {
    },
    children:[
      {
        path:'',
        component:CreateDigitalPatientIntakeComponent
      },
      {
        path:'done',
        component:PatientGreetingCreationComponent
      },
      {
        path:'corrupted',
        component:CorruptedDeviceComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatientDigitalIntakeRoutingModule { }
