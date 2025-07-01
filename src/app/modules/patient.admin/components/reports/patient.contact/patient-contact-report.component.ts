import { Component, OnInit } from '@angular/core';
import { IColumn } from '@coreui/angular-pro/lib/smart-table/smart-table.type';
import * as moment from 'moment';
import { map, Observable, tap } from 'rxjs';
import { PatientContactSearchCriteria } from 'src/app/models/reporting/patient.contact.search.criteria';
import { PaginationListTemplate } from 'src/app/modules/common/template/pagination.list.template';
import { Clinic } from '../../../models/clinic.model';
import { ClinicService } from '../../../services/clinic/clinic.service';
import { IUsers } from '../../../services/patient-list.service';
import { PatientReportingService } from '../../../services/patient.reporting.service';
import { PatientSourceReportingService } from '../../../services/reporting/source/patient-source-reporting.service';

@Component({
  selector: 'app-patient-contact-report',
  templateUrl: './patient-contact-report.component.html',
  styleUrls: ['./patient-contact-report.component.css']
})
export class PatientContactReportComponent extends PaginationListTemplate implements OnInit {

  contactType: string | null = null;
  contactTime: string | null = null;
  patientName: string
  clinics: Clinic[]
  selectedClinic: number;
  patientData$!: Observable<IUsers[]>;
  exportData : IUsers[];
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
  constructor(private patientSourceReportingService:PatientSourceReportingService,
    private patientReportingService: PatientReportingService,
    private clinicService:ClinicService) { super(); }

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
  }
  search() {
    var criteria:PatientContactSearchCriteria={
      name:this.patientName === undefined || this.patientName ==='' ?null:this.patientName,
      contactType:this.contactType!,
      contactTime:this.contactTime!,
      clinicId: this.selectedClinic
    }
     this.clinicService.selectedClinic$.subscribe(clinicId => {
      criteria.clinicId = clinicId!
      this.patientData$ =  this.patientSourceReportingService.findByContact(this.apiParams$, criteria).pipe(
        tap((response: any) => {
          this.totalItems$.next(response.number_of_matching_records);
          if (response.number_of_records) {
            this.errorMessage$.next('');
          }
          this.retry$.next(false);
          this.loadingData$.next(false);
        }),
        map((response: any) => {
          this.exportData = response.records;
          console.log(JSON.stringify(this.exportData))
          return response.records;
        })
      )
    })
  
  }
  exportResult() {
    this.patientReportingService.exportPatientContact(this.exportData).subscribe(
      (response) => {
        const a = document.createElement('a')
        const objectUrl = URL.createObjectURL(response)
        a.href = objectUrl
        var nameDatePart = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
        a.download = 'patient-' + nameDatePart + '.xlsx';
        a.click();
        URL.revokeObjectURL(objectUrl);
      },
      (error) => {
        console.log(error)
      });
  }

}
