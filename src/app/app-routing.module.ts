import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultAdminLayoutComponent, DefaultLayoutComponent } from './core';
import { ScannerlayoutComponent } from './core/scannerlayout/scannerlayout.component';
import { DigitalIntakeGuard } from './modules/security/service/digital.intake.guard/digital-intake.guard';
import { KCAuthGuardGuard } from './modules/security/service/kc/kcauth-guard.guard';


const routes: Routes = [
  {
     path: '',
    pathMatch: 'full',
    redirectTo: 'admin',
  },
  {
    path: 'admin',
    component: DefaultAdminLayoutComponent,
    canActivate: [KCAuthGuardGuard],
    data: {
      title: '',
      roles: ['administrator', 'normal']
    },
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./modules/patient.admin/patient-admin.module').then((m) => m.PatientAdminModule)
      }
    ]
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    children: [
      {
        path:'digital-intake',
        canActivate: [DigitalIntakeGuard],
        loadChildren: ()=>
        import('./modules/patient.digital.intake/patient-digital-intake.module').then((m) => m.PatientDigitalIntakeModule)
      }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
