import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';
import { MatStepper } from '@angular/material/stepper';
import { DigitalIntakeService } from '../../services/digitalIntake/digital-intake.service';

type IdentityPhase = 'phone' | 'otp' | 'verified';

@Component({
  selector: 'patient-identity-verification',
  templateUrl: './patient-identity-verification.component.html',
  styleUrls: ['./patient-identity-verification.component.css']
})
export class PatientIdentityVerificationComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() form: FormGroup;
  @Input() stepper: MatStepper;

  isValidNumber: boolean = false;
  otpString: string = '';
  otpSent: boolean = false;
  isValidOPT: boolean | null = null;
  message: string = '';
  errorMessage: string = '';
  patientUUID: string;

  phase: IdentityPhase = 'phone';
  isSending: boolean = false;
  isVerifying: boolean = false;
  shake: boolean = false;

  resendDisabled = true;
  countdown = 20;
  private interval: any;

  readonly cellSlots = [0, 1, 2, 3, 4, 5];

  @ViewChild('otpField') otpField!: ElementRef<HTMLInputElement>;

  constructor(private digitalIntakeService: DigitalIntakeService) { }

  ngOnInit(): void {
    this.checkValidNumber();
    this.evaluateInitialPhone();
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
    if (this.interval) clearInterval(this.interval);
  }

  /* ---------- Public template helpers ---------- */

  get phoneNumberValue(): string {
    return this.form.get('identity')?.get('pPhoneNumber')?.value ?? '';
  }

  get phoneDisplay(): string {
    return this.phoneNumberValue || 'your phone';
  }

  cellChar(i: number): string {
    return this.otpString[i] || '';
  }

  isOtpComplete(): boolean {
    return /^\d{6}$/.test(this.otpString);
  }

  /* ---------- Phone phase ---------- */

  sendOtp(): void {
    if (!this.isValidNumber || this.isSending) return;
    this.isSending = true;
    this.errorMessage = '';
    this.patientUUID = uuidv4();
    this.digitalIntakeService.send(this.patientUUID, this.phoneNumberValue).subscribe(
      () => {
        this.isSending = false;
        this.otpSent = true;
        this.phase = 'otp';
        this.isValidOPT = null;
        this.message = `We sent a 6-digit code to ${this.phoneDisplay}.`;
        this.otpString = '';
        this.resetCountdown();
        setTimeout(() => this.focusOtpField(), 50);
      },
      (error) => {
        this.isSending = false;
        this.errorMessage = error?.error?.message
          ?? 'We could not send a code right now. Please try again in a moment.';
      }
    );
  }

  goBackToPhone(): void {
    this.phase = 'phone';
    this.otpSent = false;
    this.isValidOPT = null;
    this.message = '';
    this.errorMessage = '';
    this.otpString = '';
    this.form.get('identity')?.get('validOTP')?.setValue(null);
    if (this.interval) clearInterval(this.interval);
  }

  /* ---------- OTP phase ---------- */

  onOtpInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const cleaned = (input.value || '').replace(/\D/g, '').slice(0, 6);
    if (input.value !== cleaned) {
      input.value = cleaned;
    }
    this.otpString = cleaned;

    this.isValidOPT = null;
    this.errorMessage = '';

    if (this.isOtpComplete()) {
      this.verifyOtp();
    }
  }

  focusOtpField(): void {
    this.otpField?.nativeElement?.focus();
  }

  verifyOtp(): void {
    if (this.isVerifying) return;
    this.isVerifying = true;
    const otpNumber = this.otpString;
    this.digitalIntakeService.validate(this.patientUUID, otpNumber).subscribe(
      (response: any) => {
        this.isVerifying = false;
        if (response.result === true) {
          this.isValidOPT = true;
          this.form.get('identity')?.get('validOTP')?.setValue(true);
          this.phase = 'verified';
          this.message = 'Phone number verified.';
          if (this.interval) clearInterval(this.interval);
        } else {
          this.handleOtpFailure('That code did not match. Please double-check and try again.');
        }
      },
      (error) => {
        this.isVerifying = false;
        this.handleOtpFailure(
          error?.error?.message
            ? `${error.error.message}. Please request a new code.`
            : 'We could not verify that code. Please try again or request a new code.'
        );
      }
    );
  }

  onResendClick(): void {
    if (this.resendDisabled) return;
    this.sendOtp();
  }

  next(): void {
    if (this.isValidOPT) this.stepper.next();
  }

  /* ---------- internals ---------- */

  private handleOtpFailure(message: string): void {
    this.isValidOPT = false;
    this.errorMessage = message;
    this.form.get('identity')?.get('validOTP')?.setValue(null);
    this.shake = true;
    setTimeout(() => (this.shake = false), 600);
    setTimeout(() => {
      this.otpString = '';
      if (this.otpField?.nativeElement) {
        this.otpField.nativeElement.value = '';
      }
      this.focusOtpField();
    }, 350);
  }

  private checkValidNumber(): void {
    this.form.get('identity')?.get('pPhoneNumber')?.valueChanges.subscribe(() => {
      this.isValidNumber = !!this.form.get('identity')?.get('pPhoneNumber')?.valid;
    });
  }

  private evaluateInitialPhone(): void {
    this.isValidNumber = !!this.form.get('identity')?.get('pPhoneNumber')?.valid;
  }

  private startCountdown(): void {
    this.resendDisabled = true;
    this.countdown = 20;
    this.interval = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        this.resendDisabled = false;
        clearInterval(this.interval);
      }
    }, 1000);
  }

  private resetCountdown(): void {
    if (this.interval) clearInterval(this.interval);
    this.startCountdown();
  }
}
