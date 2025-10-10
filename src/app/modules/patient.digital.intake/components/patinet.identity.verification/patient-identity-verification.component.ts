import { Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { OptServiceService } from '../../services/opt/opt-service.service';
import { v4 as uuidv4 } from 'uuid';
import { MatStepper } from '@angular/material/stepper';
import { DigitalIntakeService } from '../../services/digitalIntake/digital-intake.service';
@Component({
  selector: 'patient-identity-verification',
  templateUrl: './patient-identity-verification.component.html',
  styleUrls: ['./patient-identity-verification.component.css']
})
export class PatientIdentityVerificationComponent implements OnInit {
  isValidNumber: boolean
  isValidOPT: boolean
  otpArray: string[] = ['', '', '', '', '', '']; // Array to hold each OTP digit
  otpSent: boolean = false;
  message: string = '';
  @Input() form: FormGroup;
  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef>;
  patientUUID: string
  @Input() stepper: MatStepper
  resendDisabled = true;
  countdown = 20;
  interval: any;
  constructor(private digitalIntakeService: DigitalIntakeService) { }

  ngOnInit(): void {
    this.startCountdown();
    this.checkValidNumber();
  }
  private checkValidNumber() {
    this.form.get('identity')?.get('pPhoneNumber')?.valueChanges.subscribe(rr => {
      if (this.form.get('identity')?.get('pPhoneNumber')?.invalid)
        this.isValidNumber = false
      else
        this.isValidNumber = true
    })
  }
  sendOtp() {
    this.patientUUID = uuidv4();
    this.digitalIntakeService.send(this.patientUUID, this.form.get('identity')?.get('pPhoneNumber')?.value)
      .subscribe(reuslt => {
        this.otpSent = true;
        this.message = 'OTP has been sent to your phone number.';
        this.digitalIntakeService.findPatientByPhone(this.form.get('identity')?.get('pPhoneNumber')?.value).subscribe(result => {
          if(result.body !==null){
            this.digitalIntakeService.loadedPatient$.next(result.body)
          }
        })
      })
    this.resetCountdown();
  }
  onResendClick(): void {
    if (this.resendDisabled) return;
    this.sendOtp();
  }
  private startCountdown(): void {
    this.resendDisabled = true;
    this.countdown = 20;
    this.interval = setInterval(() => {
      this.countdown--;
      if (this.countdown === 0) {
        this.resendDisabled = false;
        clearInterval(this.interval);
      }
    }, 1000);
  }
  private resetCountdown(): void {
    clearInterval(this.interval);
    this.startCountdown();
  }
  isOtpComplete(): boolean {
    const result = this.otpArray.every((digit) => digit.trim() !== '' && digit.length === 1 && !isNaN(Number(digit)));
    return result;
  }


  verifyOtp() {
    const otpNumber = this.otpArray.join('').toString();
    this.digitalIntakeService.validate(this.patientUUID, otpNumber).subscribe(result => {
      this.isValidOPT = true;
      this.form.get('identity')?.get('validOTP')?.setValue(true)
      this.message = 'OTP Verified Successfully.';
    }, error => {
      this.isValidOPT = false;
      this.form.get('identity')?.get('validOTP')?.setValue(null)
      this.message = error.error.message + ' check and send it again'
    })
  }
  next() {
    this.stepper.next();
  }
}
