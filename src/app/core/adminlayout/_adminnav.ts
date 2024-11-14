import { INavData } from '@coreui/angular-pro';

export const adminNavItems: INavData[] = [
  {
    name: 'Dashboard',
    url: '/admin/dashboard',
    iconComponent: { name: 'cil-speedometer' }
  },
  {
    name: 'Patient',
    url: '',
    iconComponent: { name: 'cil-disabled' },
    children: [
      {
        name: 'Patients',
        url: 'patient/list'
      },
      {
        name: 'Submission',
        url: 'patient/create'
      }
    ]
  },
  {
    name: 'Administration',
    url: '',
    iconComponent: { name: 'cil-applicationsSettings' },
    children: [
      // {
      //   name: 'Validation List',
      //   url: 'validation/list'
      // },
      {
        name: 'Clinics',
        url: 'clinic/list'
      },
      {
        name: 'Users',
        url: 'user/list'
      },
      {
        name: 'Insurance Company',
        url: 'insurance/company/list'
      },
      {
        name: 'Trust Devices',
        url: 'trust/devices/list'
      }
    ],
  },
  {
    name: 'Reports',
    url: '',
    iconComponent: { name: 'cil-search' },
    children: [
      {
        name: 'Patient Source',
        url: 'report/recommendation'
      }
    ]
  },
  // {
  //   name: 'Auditing',
  //   url: '',
  //   iconComponent: { name: 'cil-monitor' },
  //   children: [
  //     {
  //       name: 'Entity Actions',
  //       url: 'audit/entity-audit'
  //     },
  //     {
  //       name: 'User Action',
  //       url: 'audit/user-audit'
  //     }
  //   ]
  // }
];
