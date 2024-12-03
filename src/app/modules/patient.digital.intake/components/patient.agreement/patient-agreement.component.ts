import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { DomSanitizer } from '@angular/platform-browser';
import { AgreementHolder } from 'src/app/models/patient/agreements/agreements.holder';
import { DigitalIntakeService } from '../../services/digitalIntake/digital-intake.service';
import { ValidationExploder } from '../create/validators/validation.exploder';

@Component({
  selector: 'patient-agreement',
  templateUrl: './patient-agreement.component.html',
  styleUrls: ['./patient-agreement.component.css']
})
export class PatientAgreementComponent implements OnInit, AfterViewInit {
  @Input() stepper: MatStepper
  isValidForm: boolean = false;
  @Input() form: FormGroup;
  agreements: AgreementHolder[] | null = null
  agreementFormArray: FormArray;
  constructor(private sanitizer: DomSanitizer
    , private digitalIntakeService: DigitalIntakeService) { }
  ngAfterViewInit(): void {
  }

  ngOnInit(): void {
    this.getAgreements();
  }
  private getAgreements() {
    this.digitalIntakeService.findAgreements().subscribe(response => {
      this.agreements = response.body;
      this.initForm(this.agreements)
    })
  }
  private initForm(agreements: AgreementHolder[] | null) {
    for (var i = 0; i < agreements!.length; i++) {
      var agreement: AgreementHolder = agreements![i];
      (this.form.get('agreement') as FormGroup).addControl(agreement.fieldName, new FormControl(null, agreement.required ? [Validators.required] : []))
    }
  }
  next() {
    if (this.form.get('agreement')?.valid) {
      this.stepper.next();
      this.isValidForm = false;
    } else {
      this.isValidForm = true;
      ValidationExploder.explode(this.form, 'agreement')
    }
  }
}
