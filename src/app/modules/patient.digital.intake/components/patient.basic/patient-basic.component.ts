import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import * as moment from 'moment';
import { tap } from 'rxjs';
import { ComponentReferenceComponentService } from '../../services/component.reference/component-reference-component.service';
import { CompressDocumentService } from '../../services/doument/compress-document.service';
import { ValidationExploder } from '../create/validators/validation.exploder';

@Component({
  selector: 'patient-basic',
  templateUrl: './patient-basic.component.html',
  styleUrls: ['./patient-basic.component.css']
})
export class PatientBasicComponent implements OnInit {
  fileMap: Map<string, File> = new Map();
  @Input() form: FormGroup;
  @Input() stepper: MatStepper
  isValidForm: boolean = false;
  isGuarantor: boolean = false
  months = [
    { name: 'January', value: 1 }, { name: 'February', value: 2 }, { name: 'March', value: 3 },
    { name: 'April', value: 4 }, { name: 'May', value: 5 }, { name: 'June', value: 6 },
    { name: 'July', value: 7 }, { name: 'August', value: 8 }, { name: 'September', value: 9 },
    { name: 'October', value: 10 }, { name: 'November', value: 11 }, { name: 'December', value: 12 }
  ];

  days: number[] = [];
  years: number[] = [];
  constructor(private componentReference: ComponentReferenceComponentService
    , private compressDocumentService: CompressDocumentService
  ) { }

  ngOnInit(): void {
    
    this.componentReference.setPatientBasicComponent(this)
    this.form.get('basic')?.get('dob')?.valueChanges.subscribe(value => {
      const today = moment(value).isSame(moment(), 'day');
      if (today) {
        this.isGuarantor = false;
        return false
      }
      const future = moment(value).isAfter(moment(), 'day');
      if (future) {
        this.isGuarantor = false;
        return false
      }
      var patientAge = moment().diff(value, 'y')
      this.isGuarantor = patientAge < 18 ? true : false;
    })
    this.generateDays();
    this.generateYears();
    this.setupDobSync();
  }
  public checkAge(event: any) {
    const today = moment(event).isSame(moment(), 'day');
    if (today)
      return false
    var patientAge = moment().diff(event, 'y')
    this.isGuarantor = patientAge < 18 ? true : false;
  }
  public onImageUpload(event: any, photoType: string) {
    this.compressDocumentService.setuploadedImages(this.fileMap);
    this.compressDocumentService.onImageUpload(event, photoType)
  }
  public getFormDate() {
    var imageFormData = new FormData();
    for (const [key, value] of this.fileMap) {
      imageFormData.append('files', value, key);
    }
    return imageFormData;
  }
  next() {
    if (this.form.get('basic')?.valid) {
      this.stepper.next();
      this.isValidForm = false;
    } else {
      this.isValidForm = true;
      ValidationExploder.explode(this.form, 'basic')
    }
  }
  generateDays(): void {
    this.days = Array.from({ length: 31 }, (_, i) => i + 1);
  }

  generateYears(): void {
    const currentYear = new Date().getFullYear();
    this.years = Array.from({ length: 120 }, (_, i) => currentYear - i);
  }
  getDateOfBirth(): Date | null {
    const { dobDay, dobMonth, dobYear } = this.form.value;
    if (dobDay && dobMonth && dobYear) {
      return new Date(dobYear, dobMonth - 1, dobDay); // JS months are 0-based
    }
    return null;
  }
  setupDobSync(): void {
    this.form.get('basic')?.get('dobMonth')!.valueChanges.subscribe(() => this.updateDob());
    this.form.get('basic')?.get('dobDay')!.valueChanges.subscribe(() => this.updateDob());
    this.form.get('basic')?.get('dobYear')!.valueChanges.subscribe(() => this.updateDob());
  }
  updateDob(): void {
    const month = this.form.get('basic')?.get('dobMonth')!.value;
    const day = this.form.get('basic')?.get('dobDay')!.value;
    const year = this.form.get('basic')?.get('dobYear')!.value;
  
    if (month && day && year) {
      const dobDate = new Date(+year, +month - 1, +day);
      if (!isNaN(dobDate.getTime())) {
        this.form.get('basic')?.get('dob')!.setValue(dobDate);
        this.form.get('basic')?.get('dob')!.markAsTouched();
        this.form.get('basic')?.get('dob')!.updateValueAndValidity();
      }
    } else {
      // Optional: clear DOB if one of the fields is missing
      this.form.get('basic')?.get('dob')!.setValue(null);
      this.form.get('basic')?.get('dob')!.updateValueAndValidity();
    }
  }
}

