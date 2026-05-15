import { INavData } from '@coreui/angular-pro';

export const userNavItems: INavData[] = [
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
        name: 'Intake Submission',
        url: 'patient/create',
        iconComponent: { name: 'cil-note-add' }
      },
      {
        name: 'Survey Submission',
        url: 'survey/create',
        iconComponent: { name: 'cil-comment-square' }
      }
    ]
  }
];
