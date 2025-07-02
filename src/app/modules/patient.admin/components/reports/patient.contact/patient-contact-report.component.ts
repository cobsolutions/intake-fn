import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
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
  clinics: Clinic[]
  selectedClinic: number;


  //New Search Citeria 
  searchForm!: FormGroup;
  contactTypes = [
    { label: 'All', value: null },
    { label: 'Text Message (SMS)', value: 'sms' },
    { label: 'Phone Call', value: 'call' },
    { label: 'Email', value: 'email' }
  ];

  contactTimes = [
    { label: 'All', value: null },
    { label: 'Morning (8 AM – 12 PM)', value: 'morning' },
    { label: 'Afternoon (12 PM – 4 PM)', value: 'afternoon' },
    { label: 'Evening (4 PM – 8 PM)', value: 'evening' }
  ];
  patientData$!: Observable<IUsers[]>;
  exportData: IUsers[];
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
  constructor(private patientSourceReportingService: PatientSourceReportingService,
    private patientReportingService: PatientReportingService,
    private clinicService: ClinicService,
    private fb: FormBuilder) { super(); }

  ngOnInit(): void {
    this.searchForm = this.fb.group(
      {
        contactType: [null],
        contactTime: [null],
        patientName: [''],
        startAt: [null, Validators.required],
        endAt: [null, Validators.required],
        selectedClinic:[null,Validators.required]
      },
      { validators: this.dateRangeValidator }
    );
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
  dateRangeValidator(group: AbstractControl): ValidationErrors | null {
    const start = group.get('startAt')?.value;
    const end = group.get('endAt')?.value;

    if (!start || !end || start.trim?.() === '' || end.trim?.() === '') {
      return { dateRangeRequired: true };
    }

    const startDate = new Date(start);
    const endDate = new Date(end);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return { dateRangeInvalid: true };
    }

    if (startDate > endDate) {
      return { dateRangeInvalid: true };
    }

    return null;
  }

  search() {
    this.searchForm.markAllAsTouched();
    if (this.searchForm.invalid) {
      console.warn('❌ Form is invalid');
      return; // ⛔ Prevent logic execution
    }
    console.log('Search criteria:', this.searchForm.value);
    var criteria: PatientContactSearchCriteria = {
      name: this.searchForm.value.patientName,
      contactType: this.searchForm.value.contactType,
      contactTime: this.searchForm.value.contactTime,
      clinicId : this.searchForm.value.selectedClinic
    }
    this.formatDate(criteria)
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
  private formatDate(criteria: PatientContactSearchCriteria): void {
    let startDateLong = 0;
    let endDateLong = 0;
  
    const startAt = this.searchForm.get('startAt')?.value;
    const endAt = this.searchForm.get('endAt')?.value;
  
    if (startAt) {
      startDateLong = moment(startAt).startOf('day').valueOf();
    }
  
    if (endAt) {
      endDateLong = moment(endAt).endOf('day').valueOf();
    }
    criteria.startTime=startDateLong
    criteria.endTime = endDateLong
  }
  
}
