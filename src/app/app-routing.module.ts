import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultAdminLayoutComponent, DefaultLayoutComponent } from './core';
import { ScannerlayoutComponent } from './core/scannerlayout/scannerlayout.component';
import { DigitalIntakeGuard } from './modules/security/service/digital.intake.guard/digital-intake.guard';
import { KCAuthGuardGuard } from './modules/security/service/kc/kcauth-guard.guard';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'admin',
    pathMatch: 'full',
  },
  {
    path: '',
    component: ScannerlayoutComponent,
    children: [
      {
          path:'scanner',
          loadChildren: () =>
          import('./modules/scanner/scanner.module').then((m) => m.ScannerModule)
      }
    ]
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'intake',
        canActivate: [KCAuthGuardGuard],
        loadChildren: () =>
          import('./modules/patient.questionnaire/patient-questionnaire.module').then((m) => m.PatientQuestionnaireModule)
      },
    ]
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
        canActivate: [KCAuthGuardGuard, DigitalIntakeGuard],
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
