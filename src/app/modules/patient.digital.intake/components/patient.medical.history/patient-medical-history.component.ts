import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { PatientConditions } from 'src/app/modules/patient.questionnaire/components/medical.history.information/create.patient.conditions/patient.conditions';
import { IPatientCondition } from 'src/app/modules/patient.questionnaire/components/medical.history.information/patient.condition';
import { ValidationExploder } from '../create/validators/validation.exploder';

@Component({
  selector: 'patient-medical-history',
  templateUrl: './patient-medical-history.component.html',
  styleUrls: ['./patient-medical-history.component.css']
})
export class PatientMedicalHistoryComponent implements OnInit {

  constructor() { }
  @Input() stepper: MatStepper
  isValidForm: boolean = false;
  @Input() form: FormGroup;
  initHeight: number = 0;
  initWeight: number
  patientConditions: IPatientCondition[] = PatientConditions.create();
  dropdownSettings: IDropdownSettings = {};
  ngOnInit(): void {
    this.form?.get('medicalhistory')?.get('heightUnit')?.valueChanges.subscribe(value => {
      this.convertHeight(value);
    })
    this.form?.get('medicalhistory')?.get('weightUnit')?.valueChanges.subscribe(value => {
      this.convertWeight(value);
    })
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'name',
      textField: 'name',
      itemsShowLimit: 30,
      allowSearchFilter: true
    };
  }
  convertHeight(checked: boolean) {
    var heightValue: number = this.form?.get('medicalhistory')?.get('height')?.value;
    if (checked) {
      heightValue = heightValue * 30.48

    } else {
      heightValue = Number((heightValue / 30.48).toFixed(1));

    }
    this.form?.get('medicalhistory')?.get('height')?.setValue(heightValue, { emitEvent: false });
  }
  convertWeight(checked: boolean) {
    var weightValue: number = this.form?.get('medicalhistory')?.get('weight')?.value;
    if (checked) {

      weightValue = Number((weightValue / 2.20462).toFixed(1));
    } else {
      weightValue = Math.round(weightValue * 2.20462)
    }
    this.form?.get('medicalhistory')?.get('weight')?.setValue(weightValue, { emitEvent: false });
  }
  onWeightInput() {
    let weightControl = this.form?.get('medicalhistory')?.get('weight')

    if (weightControl) {
      setTimeout(() => {
        let value = weightControl?.value?.toString(); // Ensure it's a string
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

  // Ensure we only handle up to 4 digits (max: 99 feet + 11 inches)
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

  // Prevent loop: only update if formatted is different
  if (control.value !== formatted) {
    control.setValue(formatted, { emitEvent: false });
  };
  }

  next() {
    if (this.form.get('medicalhistory')?.valid) {
      this.stepper.next();
      this.isValidForm = false;
    } else {
      this.isValidForm = true;
      ValidationExploder.explode(this.form, 'medicalhistory')
    }
  }
}
