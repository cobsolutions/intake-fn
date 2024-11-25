import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'patient-biometric-identification',
  templateUrl: './patient-biometric-identification.component.html',
  styleUrls: ['./patient-biometric-identification.component.css']
})
export class PatientBiometricIdentificationComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() stepper: MatStepper
  isValidForm: boolean = false;
  constructor() { }

  ngOnInit(): void {
  }

  next(){
    if (this.form.get('bio')?.valid) {
      this.stepper.next();
      this.isValidForm = false;
    } else {
      this.isValidForm = true;
    }
  }
}
