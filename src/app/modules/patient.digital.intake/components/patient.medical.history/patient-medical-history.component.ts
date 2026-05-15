import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { PatientConditions } from 'src/app/modules/patient.questionnaire/components/medical.history.information/create.patient.conditions/patient.conditions';
import { IPatientCondition } from 'src/app/modules/patient.questionnaire/components/medical.history.information/patient.condition';
import { ValidationExploder } from '../create/validators/validation.exploder';

interface SpecialtyOption {
  value: string;
  label: string;
  hint?: string;
}

@Component({
  selector: 'patient-medical-history',
  templateUrl: './patient-medical-history.component.html',
  styleUrls: ['./patient-medical-history.component.css']
})
export class PatientMedicalHistoryComponent implements OnInit {

  @Input() stepper: MatStepper;
  @Input() form: FormGroup;

  isValidForm: boolean = false;
  initHeight: number = 0;
  initWeight: number;
  patientConditions: IPatientCondition[] = PatientConditions.create();
  dropdownSettings: IDropdownSettings = {};

  readonly imagingOptions = [
    { value: 'MRI',   label: 'MRI' },
    { value: 'CT',    label: 'CT scan' },
    { value: 'X-ray', label: 'X-ray' }
  ];

  readonly specialtyOptions: SpecialtyOption[] = [
    { value: 'pelpt',    label: 'Pelvic Floor Therapy' },
    { value: 'cuppt',    label: 'Cupping Treatment' },
    { value: 'Lympt',    label: 'Lymphedema Therapy' },
    { value: 'oncpt',    label: 'Oncology Therapy' },
    { value: 'Pedoccpt', label: 'Pediatric Occupational' },
    { value: 'pedpt',    label: 'Pediatric Physical' },
    { value: 'pedsppt',  label: 'Pediatric Speech' },
    { value: 'strreh',   label: 'Stroke & Neurological' },
    { value: 'vesreh',   label: 'Vestibular Rehab' }
  ];

  constructor() { }

  ngOnInit(): void {
    this.form?.get('medicalhistory')?.get('heightUnit')?.valueChanges.subscribe(value => {
      this.convertHeight(value);
    });
    this.form?.get('medicalhistory')?.get('weightUnit')?.valueChanges.subscribe(value => {
      this.convertWeight(value);
    });
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'name',
      textField: 'name',
      itemsShowLimit: 30,
      allowSearchFilter: true
    };
  }

  /* -------- Multi-select array helpers (used by tile checkbox grids) -------- */

  isImagingSelected(value: string): boolean {
    return this.getMultiValue('isXRayValue').includes(value);
  }

  toggleImaging(value: string): void {
    this.toggleMulti('isXRayValue', value);
  }

  isSpecialtySelected(value: string): boolean {
    return this.getMultiValue('ptSpecialties').includes(value);
  }

  toggleSpecialty(value: string): void {
    this.toggleMulti('ptSpecialties', value);
  }

  private getMultiValue(controlName: string): string[] {
    const v = this.form?.get('medicalhistory')?.get(controlName)?.value;
    return Array.isArray(v) ? v : [];
  }

  private toggleMulti(controlName: string, value: string): void {
    const ctrl = this.form?.get('medicalhistory')?.get(controlName);
    if (!ctrl) return;
    const current = this.getMultiValue(controlName);
    const next = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    ctrl.setValue(next);
    ctrl.markAsTouched();
    ctrl.markAsDirty();
  }

  /* -------- Existing logic (preserved) -------- */

  convertHeight(checked: boolean) {
    let heightValue: number = this.form?.get('medicalhistory')?.get('height')?.value;
    if (checked) {
      heightValue = heightValue * 30.48;
    } else {
      heightValue = Number((heightValue / 30.48).toFixed(1));
    }
    this.form?.get('medicalhistory')?.get('height')?.setValue(heightValue, { emitEvent: false });
  }

  convertWeight(checked: boolean) {
    let weightValue: number = this.form?.get('medicalhistory')?.get('weight')?.value;
    if (checked) {
      weightValue = Number((weightValue / 2.20462).toFixed(1));
    } else {
      weightValue = Math.round(weightValue * 2.20462);
    }
    this.form?.get('medicalhistory')?.get('weight')?.setValue(weightValue, { emitEvent: false });
  }

  onWeightInput() {
    const weightControl = this.form?.get('medicalhistory')?.get('weight');
    if (weightControl) {
      setTimeout(() => {
        const value = weightControl?.value?.toString();
        if (value === '0') {
          weightControl?.setValue('', { emitEvent: false });
        } else if (value?.startsWith('0') && value.length > 1) {
          weightControl?.setValue(value.replace(/^0+/, ''), { emitEvent: false });
        }
      });
    }
  }

  onHeightInput() {
    const control = this.form.get('medicalhistory')?.get('height');
    if (!control) return;

    let raw = control.value?.toString().replace(/[^\d]/g, '') || '';
    raw = raw.substring(0, 4);

    let formatted = '';
    if (raw.length === 0) {
      formatted = '';
    } else if (raw.length === 1) {
      formatted = `${raw}'`;
    } else if (raw.length === 2) {
      formatted = `${raw.charAt(0)}'${raw.charAt(1)}"`;
    } else if (raw.length === 3) {
      formatted = `${raw.charAt(0)}'${raw.substring(1)}"`;
    } else {
      const feet = raw.slice(0, raw.length - 2);
      const inches = raw.slice(-2);
      formatted = `${parseInt(feet)}'${parseInt(inches)}"`;
    }

    if (control.value !== formatted) {
      control.setValue(formatted, { emitEvent: false });
    }
  }

  next() {
    if (this.form.get('medicalhistory')?.valid) {
      this.stepper.next();
      this.isValidForm = false;
    } else {
      this.isValidForm = true;
      ValidationExploder.explode(this.form, 'medicalhistory');
    }
  }
}
