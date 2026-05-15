import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { concatMap, tap } from 'rxjs';
import entityValues from 'src/app/modules/patient.admin/components/reports/_entity.values';
import { DigitalIntakeOTTService } from 'src/app/modules/security/service/digital.intake.ott.service/digital-intake-ott.service';
import { v4 as uuidv4 } from 'uuid';
import { PatientQuickIntakeRequest } from '../../../models/quick.intake/patient.quick.intake.request';
import { DigitalIntakeService } from '../../../services/digitalIntake/digital-intake.service';
import { futureDateValidator } from '../../create/validators/custom.validation/future.date.validator';
import { maxDateValidator } from '../../create/validators/custom.validation/max.date.validator';
import { todayDOBValidator } from '../../create/validators/custom.validation/today.dob.validator';
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
  patientSource: FormControl<string | null>;
}
interface PhoneForm {
  phone: FormControl<string | null>;
  otp: FormArray;
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
  surID: number;
  otpSent: boolean = false;
  isSending: boolean = false
  otpVerified = false;
  otpWrong = false;
  intakeForm!: FormGroup<IntakeForm>;
  phoneForm: FormGroup<PhoneForm>;
  renderSurvey: boolean = false;
  createdPatient: number;
  phoneRgx = /^\(\d{3}\) \d{3}-\d{4}$/;
  zipCodeRgx = new RegExp("^\\d{5}(?:[-\s]\\d{4})?$");
  // OTP controls
  otpValues: string[] = ['', '', '', '', '', ''];
  otpError = false;
  patientUUID: string
  patientQuickIntakeRequest: PatientQuickIntakeRequest
  // entityValues = entityValues.filter(
  //   entity => entity.entityValue !== 'referringDoctor'
  // );
  entityValues = entityValues;
  constructor(private fb: FormBuilder,
    private digitalIntakeService: DigitalIntakeService,
    private router: Router,
    private route: ActivatedRoute,
    private digitalIntakeOTTService: DigitalIntakeOTTService) {
  }

  ngOnInit(): void {
    this.route.queryParams.pipe(
      tap(param => {
        this.token = param['token-id'];
        this.buildPhoneForm();
        this.buildForm();
      }),
      concatMap(() => {
        return this.digitalIntakeService.findSubmissionType()
      })
    ).subscribe(response => {

      this.type = response.body.type;
      this.surID = response.body.survey;
    })


  }
  get otpControls(): FormControl[] {
    return (this.phoneForm.get('otp') as FormArray).controls as FormControl[];
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
      otp: this.fb.array(
        Array.from({ length: 6 }, () => this.fb.control('', [Validators.required, Validators.pattern('[0-9]')]))
      )
    });
  }
  private buildForm() {
    this.intakeForm = this.fb.group({
      firstName: ['', [Validators.required]],
      middleName: [''],
      lastName: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.min(15), Validators.pattern(this.phoneRgx)]],
      email: ['', [Validators.required, Validators.email]],
      dob: ['', [Validators.required, futureDateValidator(), maxDateValidator(), todayDOBValidator()]],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', [Validators.required, Validators.min(10), Validators.pattern(this.zipCodeRgx)]],
      patientSource: ['', Validators.required]
    });
  }
  saveAndStartSurvey(): void {
    if (this.intakeForm.valid) {
      this.patientQuickIntakeRequest = this.createRequest();
      this.renderSurvey = true
    } else {
      this.intakeForm.markAllAsTouched();
    }
  }
  saveAndStartSurveyLater() {
    if (this.intakeForm.valid) {
      var model: PatientQuickIntakeRequest = this.createRequest();
      model.surveyStatus = "REQUESTED_SURVEY"
      this.digitalIntakeService.createQuickIntake(model).subscribe((data: any) => {
        this.router.navigateByUrl('/digital-intake/intake-finish');
      })
    } else {
      this.intakeForm.markAllAsTouched();
    }
  }
  save() {
    if (this.intakeForm.valid) {
      var model: PatientQuickIntakeRequest = this.createRequest();
      model.surveyStatus = "NO_SURVEY"
      this.digitalIntakeService.createQuickIntake(model).subscribe((data: any) => {
        this.router.navigateByUrl('/digital-intake/intake-finish');
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
      dob: dateOfBirth,
      patientSource: this.intakeForm.value.patientSource!
    }
  }
  sendOtp() {
    if (this.pf['phone'].invalid) return;

    this.isSending = true
    var phone: string = this.pf['phone'].value === null ? '' : this.pf['phone'].value;
    this.patientUUID = uuidv4();
    this.digitalIntakeService.send(this.patientUUID, phone)
      .subscribe(reuslt => {
        this.isSending = false
        this.otpSent = true;
        //this.message = 'OTP has been sent to your phone number.';
      })
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
    this.isSending = true
    // Call backend to verify OTP
    this.digitalIntakeService.validate(this.patientUUID, this.pf['otp'].value.join('').toString()).subscribe((response: any) => {
      this.isSending = false
      this.otpVerified = response.result;
      this.otpWrong = !response.result;
    }, error => {
      this.otpVerified = false;
      this.otpWrong = true;
    })
    // Autofill verified phone into intake form
    this.intakeForm.patchValue({ phone: this.pf['phone'].value });
  }
}

