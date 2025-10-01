import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { switchMap, tap } from 'rxjs';
import { QuickIntakeService } from 'src/app/modules/patient.admin/services/quick.intake/quick-intake.service';
import { PatientQuickIntakeRequest } from '../../../models/quick.intake/patient.quick.intake.request';
import { DigitalIntakeService } from '../../../services/digitalIntake/digital-intake.service';
interface IntakeForm {
  firstName: FormControl<string | null>;
  middleName: FormControl<string | null>;
  lastName: FormControl<string | null>;
  phone: FormControl<string | null>;
  email: FormControl<string | null>;
  // insuranceCompany: FormControl<string | null>;
  dob: FormControl<string | null>;
  address: FormControl<string | null>;
  city: FormControl<string | null>;
  state: FormControl<string | null>;
  zipCode: FormControl<string | null>;
}
interface PhoneForm {
  phone: FormControl<string | null>;
  otp: FormControl<string | null>;
}
@Component({
  selector: 'app-create-quick-intake',
  templateUrl: './create-quick-intake.component.html',
  styleUrls: ['./create-quick-intake.component.css']
})
export class CreateQuickIntakeComponent implements OnInit {
  type: string;
  token: string;
  requester: string
  otpSent = false;
  otpVerified = false;
  intakeForm!: FormGroup<IntakeForm>;
  phoneForm: FormGroup<PhoneForm>;
  renderSurvey: boolean = false;
  createdPatient: number;
  phoneRgx = /^\(\d{3}\) \d{3}-\d{4}$/;
  zipCodeRgx = new RegExp("^\\d{5}(?:[-\s]\\d{4})?$");
  // OTP controls
  otpControls = Array(6).fill(0);
  otpValues: string[] = ['', '', '', '', '', ''];
  otpError = false;
  constructor(private fb: FormBuilder,
    private digitalIntakeService: DigitalIntakeService,
    private router: Router,
    private route: ActivatedRoute,
    private quickIntakeService: QuickIntakeService) {
  }

  ngOnInit(): void {
    this.route.queryParams.pipe(
      tap(param => {
        this.token = param['token'];
        this.type = param['type'];
        this.requester = param['requester']
      }),
      switchMap(token => this.quickIntakeService.create(this.token, this.requester))
    ).subscribe(dd => { })
    this.route.queryParams.subscribe((param: any) => {

      this.buildPhoneForm();
      this.buildForm();
    })

  }
  formatPhone(event: any) {
    let input = event.target.value.replace(/\D/g, ''); // strip non-digits
    if (input.length > 10) {
      input = input.substring(0, 10);
    }

    let formatted = input;
    if (input.length > 6) {
      formatted = `(${input.substring(0, 3)}) ${input.substring(3, 6)}-${input.substring(6)}`;
    } else if (input.length > 3) {
      formatted = `(${input.substring(0, 3)}) ${input.substring(3)}`;
    } else if (input.length > 0) {
      formatted = `(${input}`;
    }

    event.target.value = formatted;
    this.phoneForm.patchValue({ phone: formatted }, { emitEvent: false });
  }
  private buildPhoneForm() {
    this.phoneForm = this.fb.group({
      phone: ['', [Validators.required]],
      otp: ['']
    });
  }
  private buildForm() {
    this.intakeForm = this.fb.group({
      firstName: ['', [Validators.required]],
      middleName: [''],
      lastName: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.min(15), Validators.pattern(this.phoneRgx)]],
      email: ['', [Validators.required, Validators.email]],
      // insuranceCompany: ['', Validators.required],
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
      model.surveyStatus = "HAS_SURVEY"
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
    if (this.intakeForm.valid) {
      var model: PatientQuickIntakeRequest = this.createRequest();
      model.surveyStatus = "REQUESTED_SURVEY"
      this.digitalIntakeService.createQuickIntake(model).subscribe((data: any) => {
        this.router.navigateByUrl('/digital-intake/done?token=' + this.digitalIntakeService.token);
      })
    } else {
      this.intakeForm.markAllAsTouched();
    }

  }
  get f() {
    return this.intakeForm.controls;
  }
  get pf() {
    return this.phoneForm.controls;
  }
  private createRequest(): PatientQuickIntakeRequest {
    const dateOfBirth: number = Number(moment(this.intakeForm.value.dob).format("x"));
    return {
      firstName: this.intakeForm.value.firstName!,
      middleName: this.intakeForm.value.middleName!,
      lastName: this.intakeForm.value.lastName!,
      phone: (this.intakeForm.value.phone!).toString(),
      email: this.intakeForm.value.email!,
      // insuranceCompany: this.intakeForm.value.insuranceCompany!,
      address: this.intakeForm.value.address!,
      city: this.intakeForm.value.city!,
      state: this.intakeForm.value.state!,
      zipCode: this.intakeForm.value.zipCode!,
      dob: dateOfBirth
    }
  }
  sendOtp() {
    if (this.pf['phone'].invalid) return;

    // 🔹 Call backend to send OTP
    console.log('Sending OTP to', this.pf['phone'].value);
    this.otpSent = true;
  }
  onOtpInput(event: any, index: number) {
    const input = event.target;
    const value = input.value.replace(/[^0-9]/g, ''); // only digits
    this.otpValues[index] = value;

    if (value && index < this.otpControls.length - 1) {
      const next = input.nextElementSibling;
      if (next) next.focus();
    }
  }

  onOtpBackspace(event: any, index: number) {
    if (!this.otpValues[index] && index > 0) {
      const prev = (event.target as HTMLInputElement).previousElementSibling as HTMLInputElement;
      if (prev) prev.focus();
    }
  }
  verifyOtp() {
    if (this.pf['otp'].invalid) return;

    // 🔹 Call backend to verify OTP
    console.log('Verifying OTP', this.pf['otp'].value);

    // For now, mock success
    this.otpVerified = true;

    // Autofill verified phone into intake form
    this.intakeForm.patchValue({ phone: this.pf['phone'].value });
  }
}
