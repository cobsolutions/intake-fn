import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import * as moment from 'moment';
import { map, Observable, tap } from 'rxjs';
import { PatientSurveyCriteria } from 'src/app/models/reporting/patient.survey.criteria';
import { PaginationListTemplate } from 'src/app/modules/common/template/pagination.list.template';
import { Clinic } from '../../../models/clinic.model';
import { ClinicService } from '../../../services/clinic/clinic.service';
import { IUsers } from '../../../services/patient-list.service';
import { PatientSourceReportingService } from '../../../services/reporting/source/patient-source-reporting.service';

@Component({
  selector: 'patientsurvey-report',
  templateUrl: './patientsurvey-report.component.html',
  styleUrls: ['./patientsurvey-report.component.css']
})
export class PatientsurveyReportComponent extends PaginationListTemplate implements OnInit {
  exportResult() {
    throw new Error('Method not implemented.');
  }
  searchForm!: FormGroup;
  clinics: Clinic[]
  selectedClinic: number;
  exportData: IUsers[];
  patientData$!: Observable<IUsers[]>;
  search() {
    this.searchForm.markAllAsTouched();
    if (this.searchForm.invalid) {
      console.warn('❌ Form is invalid');
      return; // ⛔ Prevent logic execution
    }

    var criteria: PatientSurveyCriteria = {
      clinicId : this.searchForm.value.selectedClinic
    }
    this.formatDate(criteria)
    console.log(JSON.stringify(criteria))
    this.patientData$ =  this.patientSourceReportingService.findPatientSurvey(this.apiParams$, criteria).pipe(
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

  constructor(private clinicService: ClinicService,private fb: FormBuilder,private patientSourceReportingService: PatientSourceReportingService) {

    super();
  }

  ngOnInit(): void {
    this.searchForm = this.fb.group(
      {
        startAt: [null, Validators.required],
        endAt: [null, Validators.required],
        selectedClinic: [null, Validators.required]
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
  private formatDate(criteria: PatientSurveyCriteria): void {
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
