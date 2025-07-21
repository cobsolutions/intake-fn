import { Component, OnInit } from '@angular/core';
import { IColumn } from '@coreui/angular-pro/lib/smart-table/smart-table.type';
import { map, Observable, tap } from 'rxjs';
import { PaginationListTemplate } from 'src/app/modules/common/template/pagination.list.template';
import { FailedPatientRecord } from '../../models/failed.patient.record';
import { FailedServiceService } from '../../services/failed.patient/failed-service.service';

@Component({
  selector: 'app-failed-patient',
  templateUrl: './failed-patient.component.html',
  styleUrls: ['./failed-patient.component.css']
})
export class FailedPatientComponent extends PaginationListTemplate implements OnInit {
  //create model for failed pateint model
  patientData$!: Observable<FailedPatientRecord[]>;
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
      key: 'maritalStatus',
      label: 'Marital Status'
    },
    {
      key: 'gender',
      label: 'Gender'
    },
    {
      key: 'patientIntakeUUID',
      label: 'Intake Numder'
    }
  ];
  constructor(private failedServiceService:FailedServiceService) { super();}

  ngOnInit(): void {
    this.initListComponent();
    this.patientData$ = this.failedServiceService.find(this.apiParams$).pipe(
      tap((response: any) => {
        this.totalItems$.next(response.number_of_matching_records);
        if (response.number_of_records) {
          this.errorMessage$.next('');
        }
        this.retry$.next(false);
        this.loadingData$.next(false);
      }),
      map((response: any) => {
        return response.records;
      })
    )
  }

}
