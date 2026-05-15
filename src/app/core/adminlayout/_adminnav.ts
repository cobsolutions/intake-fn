import { INavData } from '@coreui/angular-pro';

export const adminNavItems: INavData[] = [
  {
    name: 'OVERVIEW',
    title: true
  },
  {
    name: 'Dashboard',
    url: '/admin/dashboard',
    iconComponent: { name: 'cil-speedometer' }
  },

  {
    name: 'PATIENTS',
    title: true
  },
  {
    name: 'Patient',
    url: '',
    iconComponent: { name: 'cil-people' },
    children: [
      {
        name: 'Patients',
        url: 'patient/list',
        iconComponent: { name: 'cil-list' }
      },
      {
        name: 'Failed Patients',
        url: 'patient/failed',
        iconComponent: { name: 'cil-flag-alt' }
      },
      {
        name: 'Intake Submission',
        url: 'patient/create',
        iconComponent: { name: 'cil-note-add' }
      }
    ]
  },

  {
    name: 'ADMINISTRATION',
    title: true
  },
  {
    name: 'Settings',
    url: '',
    iconComponent: { name: 'cil-applications-settings' },
    children: [
      {
        name: 'Clinics',
        url: 'clinic/list',
        iconComponent: { name: 'cil-library-building' }
      },
      {
        name: 'Users',
        url: 'user/list',
        iconComponent: { name: 'cil-user' }
      },
      {
        name: 'Insurance Companies',
        url: 'insurance/company/list',
        iconComponent: { name: 'cil-credit-card' }
      },
      {
        name: 'Trusted Devices',
        url: 'trust/devices/list',
        iconComponent: { name: 'cil-tablet' }
      }
    ]
  },

  {
    name: 'INSIGHTS',
    title: true
  },
  {
    name: 'Reports',
    url: '',
    iconComponent: { name: 'cil-chart-pie' },
    children: [
      {
        name: 'Patient Source',
        url: 'report/recommendation',
        iconComponent: { name: 'cil-chart' }
      },
      {
        name: 'Patient Changes',
        url: 'report/changes',
        iconComponent: { name: 'cil-history' }
      },
      {
        name: 'Patient Contact',
        url: 'report/contact',
        iconComponent: { name: 'cil-speech' }
      }
    ]
  }
];
