import { Component, OnInit } from '@angular/core';
import { IColumn } from '@coreui/angular-pro/lib/smart-table/smart-table.type';
import { Observable } from 'rxjs';
import { PaginationListTemplate } from 'src/app/modules/common/template/pagination.list.template';

@Component({
  selector: 'app-failed-patient',
  templateUrl: './failed-patient.component.html',
  styleUrls: ['./failed-patient.component.css']
})
export class FailedPatientComponent extends PaginationListTemplate implements OnInit {
  //create model for failed pateint model
  patientData$!: Observable<any[]>;
  readonly columns: (string | IColumn)[] = [
    {
      key: 'patientName',
      label: 'Patient Name'
    },
    {
      key: 'email',
      label: 'Email'
    },
    {
      key: 'phoneNumber',
      label: 'Phone Number'
    },
    {
      key: 'gender',
      label: 'Gender'
    }
  ];
  constructor() { super();}

  ngOnInit(): void {
  }

}
