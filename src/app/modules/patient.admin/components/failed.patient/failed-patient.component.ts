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
  errorMessageVisibility:boolean = false
  dataVisibility:boolean = false
  intakeErrorMessage:string;
  errorData:any
  copySuccess = false;
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
    },
    {
      key: 'actions',
      label: 'Actions',
      sorter: false,
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
  details_visible = Object.create({});
  toggleDetails(item: any) {
    this.details_visible[item] = !this.details_visible[item];
  }
  toggleShowErrorMessage(){
    this.errorMessageVisibility = !this.errorMessageVisibility ;
  }
  toggleShowData(){
    this.dataVisibility = !this.dataVisibility ;
  }
  onClickErrorMessage(intakeErrorMessage:string){
    this.errorMessageVisibility =true;
    this.intakeErrorMessage = intakeErrorMessage;
  }
  onClickShowData(errorData:any){
    this.dataVisibility =true;
    this.errorData = errorData;
  }
  copyJson() {
    const formatted = JSON.stringify(this.errorData, null, 2);
    navigator.clipboard.writeText(formatted).then(() => {
      this.copySuccess = true;
      setTimeout(() => this.copySuccess = false, 2000); // Hide after 2s
    });
  }
}
