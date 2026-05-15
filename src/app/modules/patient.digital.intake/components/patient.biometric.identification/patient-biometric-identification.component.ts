import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { WebcamImage, WebcamInitError } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'patient-biometric-identification',
  templateUrl: './patient-biometric-identification.component.html',
  styleUrls: ['./patient-biometric-identification.component.css']
})
export class PatientBiometricIdentificationComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() stepper: MatStepper;
  @Input() isActive: number;

  isValidForm: boolean = false;
  public webcamImage: WebcamImage | null = null;
  public capturedImage: string | null = null;

  cameraError: string | null = null;
  facingMode: 'user' | 'environment' = 'user';

  private trigger: Subject<void> = new Subject<void>();
  private nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();

  constructor() { }

  ngOnInit(): void {}

  next() {
    if (this.form.get('bio')?.valid) {
      this.stepper.next();
      this.isValidForm = false;
    } else {
      this.isValidForm = true;
    }
  }

  public triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public switchCameraObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }

  public captureImage(): void {
    this.trigger.next();
  }

  public toggleCamera(): void {
    this.facingMode = this.facingMode === 'user' ? 'environment' : 'user';
    this.nextWebcam.next(true);
  }

  public handleImage(webcamImage: WebcamImage): void {
    this.webcamImage = webcamImage;
    this.capturedImage = webcamImage.imageAsDataUrl;
    this.form.get('bio')?.get('capturedImage')?.setValue(webcamImage.imageAsDataUrl);
    this.isValidForm = false;
  }

  public handleInitError(error: WebcamInitError): void {
    if (error.mediaStreamError && error.mediaStreamError.name === 'NotAllowedError') {
      this.cameraError = 'Camera access was blocked. Please allow camera permission in your browser settings, then refresh the page.';
    } else if (error.mediaStreamError && error.mediaStreamError.name === 'NotFoundError') {
      this.cameraError = 'We could not find a camera on this device. Please try a different device or ask the front desk for help.';
    } else {
      this.cameraError = 'We could not start the camera. Please refresh the page and try again.';
    }
  }

  public clearImage(): void {
    this.form.get('bio')?.get('capturedImage')?.setValue(null);
    this.webcamImage = null;
    this.capturedImage = null;
  }

  get hasPhoto(): boolean {
    return !!this.capturedImage || !!this.form.get('bio')?.get('capturedImage')?.value;
  }

  get currentPhoto(): string | null {
    return this.capturedImage || this.form.get('bio')?.get('capturedImage')?.value || null;
  }

  get videoOptions(): MediaTrackConstraints {
    return {
      facingMode: this.facingMode,
      width: { ideal: 720 },
      height: { ideal: 720 }
    };
  }
}
