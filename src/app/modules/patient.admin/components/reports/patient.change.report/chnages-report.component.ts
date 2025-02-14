import { Component, OnInit } from '@angular/core';
import { IColumn } from '@coreui/angular-pro/lib/smart-table/smart-table.type';
import { map, Observable, switchMap, tap } from 'rxjs';
import { PaginationListTemplate } from 'src/app/modules/common/template/pagination.list.template';
import { Clinic } from '../../../models/clinic.model';
import { PatientChangesRecord } from '../../../models/monitor/patient.changes.record';
import { ClinicService } from '../../../services/clinic/clinic.service';
import { PatientChangesService } from '../../../services/monitor/patient-changes.service';

@Component({
  selector: 'app-chnages-report',
  templateUrl: './chnages-report.component.html',
  styleUrls: ['./chnages-report.component.css']
})
export class ChnagesReportComponent extends PaginationListTemplate implements OnInit {
  action: string;
  patientName: string = '';
  searchInputNotValid: boolean = false;
  errorMsg: string;
  clinics: Clinic[]
  selectedClinic: number;
  changes: Observable<PatientChangesRecord[]>;
  readonly columns: (string | IColumn)[] = [
    {
      key: 'patientName',
      label: 'Patient'
    },
    {
      key: 'userName',
      label: 'User Name'
    },
    {
      key: 'userAccount',
      label: 'User Account'
    },
    {
      key: 'userEmail',
      label: 'User Email'
    },
    {
      key: 'userUUID',
      label: 'User ID'
    },
    {
      key: 'createdAt',
      label: 'Change date'
    }
  ];
  constructor(private patientChangesService: PatientChangesService
    , private clinicService: ClinicService) { super(); }

  ngOnInit(): void {
    this.clinicService.get().pipe(
      map(result => result.body)
    )
      .subscribe((clinics: any) => {
        this.clinics = clinics
        if (this.clinics[0].id !== null)
          this.selectedClinic = this.clinics[0].id
      })
    this.initListComponent();
    this.action = '1'
  }
  search() {
    this.searchInputNotValid = false
    this.errorMsg = '';
    this.changes = this.patientChangesService.find(this.apiParams$, this.selectedClinic, this.patientName, this.action!).pipe(
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
