import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'patient-consent',
  templateUrl: './patient-consent.component.html',
  styleUrls: ['./patient-consent.component.css']
})
export class PatientConsentComponent implements OnInit {
  @Input() stepper: MatStepper
  @Input() form: FormGroup;
  constructor() { }

  ngOnInit(): void {
  }
  accept() {
    this.stepper.next();
  }
}
