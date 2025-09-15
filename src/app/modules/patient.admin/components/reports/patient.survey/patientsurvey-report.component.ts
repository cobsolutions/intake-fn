import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { map } from 'rxjs';
import { PaginationListTemplate } from 'src/app/modules/common/template/pagination.list.template';
import { Clinic } from '../../../models/clinic.model';
import { ClinicService } from '../../../services/clinic/clinic.service';
import { IUsers } from '../../../services/patient-list.service';

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
  search() {
    throw new Error('Method not implemented.');
  }

  constructor(private clinicService: ClinicService,private fb: FormBuilder) {

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
}
