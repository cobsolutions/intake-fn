import { Component, OnInit } from '@angular/core';
import { IColumn } from '@coreui/angular-pro/lib/smart-table/smart-table.type';
import { map, Observable, switchMap, tap } from 'rxjs';
import { PaginationListTemplate } from 'src/app/modules/common/template/pagination.list.template';
import { PatientChangesRecord } from '../../../models/monitor/patient.changes.record';
import { ClinicService } from '../../../services/clinic/clinic.service';
import { PatientChangesService } from '../../../services/monitor/patient-changes.service';

@Component({
  selector: 'app-chnages-report',
  templateUrl: './chnages-report.component.html',
  styleUrls: ['./chnages-report.component.css']
})
export class ChnagesReportComponent extends PaginationListTemplate implements OnInit {
  action: string | null = null;
  patientName: string | null = null;
  searchInputNotValid: boolean = false;
  errorMsg: string;
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
    this.initListComponent();
    this.action = '1'
  }
  search() {
    if (this.patientName === '' || this.patientName === null) {
      this.searchInputNotValid = true
      this.errorMsg = "Please select patient"
    } else {
      this.searchInputNotValid = false
      this.errorMsg = '';
      this.changes = this.clinicService.selectedClinic$.pipe(
        switchMap((clinicId: any) => this.patientChangesService.find(this.apiParams$, clinicId, this.patientName!, this.action!)),
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
}
