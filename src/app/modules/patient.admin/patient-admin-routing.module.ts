import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PatientsignatureComponent } from '../patient.questionnaire';
import { AuditComponent } from './components/audit/audit.component';
import { UserAuditComponent } from './components/audit/user.audit/user-audit.component';
import { ClinicCreationComponent } from './components/clinic/create/clinic.creation.component';
import { ClinicListComponent } from './components/clinic/list/clinic.list.component';
import { UpdateClinicComponent } from './components/clinic/update/update-clinic.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { InsuranceCompanyCreateComponent } from './components/insurance.company/create/insurance-company-create.component';
import { InsuranceCompanyListComponent } from './components/insurance.company/list/insurance-company-list.component';
import { PatientCreateComponent } from './components/patient.create/patient-create.component';
import { PatientListComponent } from './components/patient.list/patient.list.component';
import { ChnagesReportComponent } from './components/reports/patient.change.report/chnages-report.component';
import { PatientContactReportComponent } from './components/reports/patient.contact/patient-contact-report.component';
import { RecommendationReportComponent } from './components/reports/recommendation.report.component';
import { ListTrustDevicesComponent } from './components/trust.device/list/list-trust-devices.component';
import { UserCreationComponent } from './components/user/create/user-creation.component';
import { UserListComponent } from './components/user/list/user-list.component';
import { UserUpdateComponent } from './components/user/update/user-update.component';
import { ValidationListComponent } from './components/validation/validation.list.component';

const routes: Routes = [{
  path: 'dashboard',
  component: DashboardComponent,
  data: {
    title: 'Dashboard'
  }
},
{
  path: '',
  data: {
    title: 'Patient',
  },
  children: [
    {
      path: 'patient/list',
      component: PatientListComponent,
      data: {
        title: 'List',
      },
    },
    {
      path: 'patient/create',
      component: PatientCreateComponent,
      data: {
        title: 'Create',
      },
    }
  ]
},
{
  path: '',
  data: {
    title: 'Administration',
  },
  children: [
    {
      path: 'validation/list',
      component: ValidationListComponent,
      data: {
        title: 'validation-fields',
      },
    },
    {
      path: 'clinic/list',
      component: ClinicListComponent,
      data: {
        title: 'Clinics List',
      },
    },
    {
      path: 'clinic/creation',
      component: ClinicCreationComponent,
      data: {
        title: 'Clinic Creation',
      },
    },
    {
      path: 'clinic/update/:clinicId',
      component: UpdateClinicComponent,
      data: {
        title: 'Clinic Update',
      },
    },
    {
      path: 'user/list',
      component: UserListComponent,
      data: {
        title: 'Users List',
      },
    },
    {
      path: 'user/creation',
      component: UserCreationComponent,
      data: {
        title: 'User Creation',
      },
    },
    {
      path: 'user/update/:userId',
      component: UserUpdateComponent,
      data: {
        title: 'User update',
      }
    },
    {
      path: 'insurance/company/list',
      component: InsuranceCompanyListComponent,
      data: {
        title: 'Insurance Companies List',
      }
    },
    {
      path: 'insurance/company/create',
      component: InsuranceCompanyCreateComponent,
      data: {
        title: 'insurance-company-create',
      }
    },
    {
      path: 'trust/devices/list',
      component: ListTrustDevicesComponent,
      data: {
        title: 'insurance-company-create',
      }
    }
  ]
},
{
  path: '',
  data: {
    title: 'Reports',
  },
  children: [
    {
      path: 'report/recommendation',
      component: RecommendationReportComponent,
      data: {
        title: 'Patient Source',
      },
    },
    {
      path: 'report/changes',
      component: ChnagesReportComponent,
      data: {
        title: 'Patient changes',
      },
    },
    {
      path: 'report/contact',
      component: PatientContactReportComponent,
      data: {
        title: 'Patient Contact',
      },
    }
  ]
},
{
  path: '',
  data: {
    title: 'Auditing',
  },
  children: [
    {
      path: 'audit/entity-audit',
      component: AuditComponent,
      data: {
        title: 'audit-entity',
      },
    }, {
      path: 'audit/user-audit',
      component: UserAuditComponent,
      data: {
        title: 'audit-user',
      },
    }
  ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatientAdminRoutingModule { }
