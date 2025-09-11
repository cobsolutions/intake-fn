import { INavData } from '@coreui/angular-pro';

export const userNavItems: INavData[] = [
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
        name: 'Intake Submission',
        url: 'patient/create'
      },
      {
        name: 'Survey Submission',
        url: 'survey/create'
      }
    ]
  }
];
