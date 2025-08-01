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
  
  agreementFormArray: FormArray;
  visibleAgreement: boolean
  agreements: AgreementHolder[] | null = null
  constructor(private sanitizer: DomSanitizer
    , private digitalIntakeService: DigitalIntakeService) { }
  ngAfterViewInit(): void {
  }

  ngOnInit(): void {
    this.digitalIntakeService.findAgreements().subscribe(response => {
      this.agreements = response.body ?? [];
  
      // Initialize default properties
      this.agreements.forEach(agreement => {
        agreement.accept = false;
        agreement.visible = agreement.id === 1;
      });
  
      this.initForm(this.agreements); // Initial form setup
  
      // Watch for pelvic selection changes
      this.form.get('medicalhistory')?.get('ptSpecialties')?.valueChanges.subscribe(ptVal => {
        this.updateAgreementRequirement(ptVal);
      });
  
      // Apply rules for initial value
      const initialVal = this.form.get('medicalhistory')?.get('ptSpecialties')?.value;
      this.updateAgreementRequirement(initialVal);
    });
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
  acceptConcent(agreement: AgreementHolder, event: any) {
    if (this.agreements !== null)
      for (let i = 0; i < this.agreements?.length; i++) {
        if (this.agreements[i].id === agreement.id) {
          agreement.accept = (event.target as HTMLInputElement).checked
          this.agreements[i + 1].visible = true;
          this.agreements[i].visible = false;
        }
      }
  }
  private isPelvic(list: string[]): boolean {
    return list?.includes('pelpt') ?? false;
  }
  private updateAgreementRequirement(ptVal: string[]): void {
    const pelvicSelected = this.isPelvic(ptVal);
  
    this.agreements?.forEach(agreement => {
      if (agreement.id === 12) {
        agreement.required = pelvicSelected;
      }
    });
  
    this.initForm(this.agreements);
  }
  private initForm(agreements: AgreementHolder[] | null): void {
    const agreementGroup = this.form.get('agreement') as FormGroup;
  
    agreements?.forEach(agreement => {
      const controlExists = agreementGroup.contains(agreement.fieldName);
      const validators = agreement.required ? [Validators.requiredTrue] : [];
  
      if (controlExists) {
        // Update validators if control exists
        const control = agreementGroup.get(agreement.fieldName);
        control?.setValidators(validators);
        control?.updateValueAndValidity();
      } else {
        // Add new control if it doesn't exist
        agreementGroup.addControl(agreement.fieldName, new FormControl(null, validators));
      }
    });
  }
}
