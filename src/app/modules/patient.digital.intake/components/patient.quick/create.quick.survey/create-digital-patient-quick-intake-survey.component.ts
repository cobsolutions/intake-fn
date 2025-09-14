import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import { PatientQuickIntakeRequest } from '../../../models/quick.intake/patient.quick.intake.request';
import { DigitalIntakeService } from '../../../services/digitalIntake/digital-intake.service';
interface IntakeForm {
  firstName: FormControl<string | null>;
  middleName: FormControl<string | null>;
  lastName: FormControl<string | null>;
  phone: FormControl<string | null>;
  email: FormControl<string | null>;
  insuranceCompany: FormControl<string | null>;
  dob: FormControl<string | null>;
  address: FormControl<string | null>;
  city: FormControl<string | null>;
  state: FormControl<string | null>;
  zipCode: FormControl<string | null>;
}
@Component({
  selector: 'app-create-digital-patient-quick-intake-survey',
  templateUrl: './create-digital-patient-quick-intake-survey.component.html',
  styleUrls: ['./create-digital-patient-quick-intake-survey.component.css']
})
export class CreateDigitalPatientQuickIntakeSurveyComponent implements OnInit {
  intakeForm!: FormGroup<IntakeForm>;
  renderSurvey: boolean = false;
  createdPatient: number;
  phoneRgx = /^\(\d{3}\) \d{3}-\d{4}$/;
  zipCodeRgx = new RegExp("^\\d{5}(?:[-\s]\\d{4})?$");
  constructor(private fb: FormBuilder, private digitalIntakeService: DigitalIntakeService) { }

  ngOnInit(): void {
    this.intakeForm = this.fb.group({
      firstName: ['', [Validators.required]],
      middleName: [''],
      lastName: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.min(15), Validators.pattern(this.phoneRgx)]],
      email: ['', [Validators.required, Validators.email]],
      insuranceCompany: ['', Validators.required],
      dob: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', [Validators.required, Validators.min(10), Validators.pattern(this.zipCodeRgx)]]
    });
  }
  saveAndStartSurvey(): void {
    if (this.intakeForm.valid) {
      var model: PatientQuickIntakeRequest = this.createRequest();
      this.digitalIntakeService.createQuickIntake(model).subscribe((data: any) => {
        console.log(data.body)
        this.createdPatient = data.body
        this.renderSurvey = true
      })
    } else {
      this.intakeForm.markAllAsTouched();
    }
  }
  saveAndStartSurveyLater() {

  }
  get f() {
    return this.intakeForm.controls;
  }
  private createRequest(): PatientQuickIntakeRequest {
    const dateOfBirth:number =  Number(moment(this.intakeForm.value.dob).format("x"));
    return {
      firstName: this.intakeForm.value.firstName!,
      middleName: this.intakeForm.value.middleName!,
      lastName: this.intakeForm.value.lastName!,
      phone: (this.intakeForm.value.phone!).toString(),
      email: this.intakeForm.value.email!,
      insuranceCompany: this.intakeForm.value.insuranceCompany!,
      address: this.intakeForm.value.address!,
      city: this.intakeForm.value.city!,
      state: this.intakeForm.value.state!,
      zipCode: this.intakeForm.value.zipCode!,
      dob: dateOfBirth
    }
  }
}
