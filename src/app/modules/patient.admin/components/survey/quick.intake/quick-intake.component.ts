import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
interface IntakeForm {
  firstName: FormControl<string | null>;
  middleName: FormControl<string | null>;
  lastName: FormControl<string | null>;
  phone: FormControl<string | null>;
  email: FormControl<string | null>;
}
@Component({
  selector: 'quick-intake',
  templateUrl: './quick-intake.component.html',
  styleUrls: ['./quick-intake.component.css']
})
export class QuickIntakeComponent implements OnInit {

  intakeForm!: FormGroup<IntakeForm>;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.intakeForm = this.fb.group({
      firstName: ['', [Validators.required]],
      middleName: [''],
      lastName: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }
  saveAndStartSurvey(): void {
    if (this.intakeForm.valid) {
      console.log('Save & Start Survey:', this.intakeForm.value);
      // 🚀 Call backend API to create patient & start survey
    } else {
      this.intakeForm.markAllAsTouched();
    }
  }
  saveAndStartSurveyLater() {

  }
  get f() {
    return this.intakeForm.controls;
  }

}
