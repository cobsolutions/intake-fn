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
  visibleAgreement: boolean
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
      if (this.agreements !== null)
        for (let i = 0; i < this.agreements.length; i++) {
          this.agreements[i].accept = false;
          if (this.agreements[i].id === 1)
            this.agreements[i].visible = true
          else
            this.agreements[i].visible = false

        }
      this.initForm(this.agreements)
    })
  }
  private initForm(agreements: AgreementHolder[] | null) {
    for (var i = 0; i < agreements!.length; i++) {
      var agreement: AgreementHolder = agreements![i];
      (this.form.get('agreement') as FormGroup).addControl(agreement.fieldName, new FormControl(null, agreement.required ? [Validators.requiredTrue] : []))
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
  getAllFormValues(formGroup: FormGroup): any {
    const values: any = {};
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      if (control instanceof FormControl) {
        values[key] = control.value;
      } else if (control instanceof FormGroup) {
        values[key] = this.getAllFormValues(control); // Recursively get values from nested FormGroup
      } else if (control instanceof FormArray) {
        values[key] = control.controls.map(ctrl =>
          ctrl instanceof FormGroup ? this.getAllFormValues(ctrl) : ctrl.value
        );
      }
    });
    return values;
  }
  acceptConcent(agreement: AgreementHolder, event:any) {
    if (this.agreements !== null)
      for (let i = 0; i < this.agreements?.length; i++) {
        if (this.agreements[i].id === agreement.id){
          agreement.accept = (event.target as HTMLInputElement).checked
          this.agreements[i + 1].visible = true;
          this.agreements[i].visible = false;
        }
      }
  }
}
