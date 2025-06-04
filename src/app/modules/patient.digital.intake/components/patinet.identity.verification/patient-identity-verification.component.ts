import { Component, ElementRef, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
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
  constructor(private digitalIntakeService:DigitalIntakeService) { }

  ngOnInit(): void {
    this.checkValidNumber();
  }
  private checkValidNumber() {
    if (this.form.get('identity')?.valid)
      this.isValidNumber = true
    else
      this.isValidNumber = false
  }
  sendOtp() {
    this.patientUUID = uuidv4();
    this.digitalIntakeService.send(this.patientUUID, this.form.get('identity')?.get('pPhoneNumber')?.value)
      .subscribe(reuslt => {
        this.otpSent = true;
        this.message = 'OTP has been sent to your phone number.';
      })
  }
  isOtpComplete(): boolean {
    const result = this.otpArray.every((digit) => digit.trim() !== '' && digit.length === 1 && !isNaN(Number(digit)));
    return result;
  }


  verifyOtp() {
    const otpNumber = this.otpArray.join('').toString();
    this.digitalIntakeService.validate(this.patientUUID, otpNumber).subscribe(result => {
      this.isValidOPT = true;
      this.message = 'OTP Verified Successfully.';
    }, error => {
      this.isValidOPT = false;
      this.message = error.error.message + 'check and send it again'
    })
  }
  next(){
    this.stepper.next();
  }
}
