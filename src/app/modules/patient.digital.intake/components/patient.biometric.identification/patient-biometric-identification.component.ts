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
  @Input() stepper: MatStepper
  @Input() isActive: number
  isValidForm: boolean = false;
  public webcamImage: WebcamImage | null = null;
  public capturedImage: string | null = null;

  private trigger: Subject<void> = new Subject<void>();

  constructor() { }

  ngOnInit(): void {
    
  }

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
  public captureImage(): void {
    this.trigger.next();
  }
  public handleImage(webcamImage: WebcamImage): void {
    this.webcamImage = webcamImage;
    this.form.get('bio')?.get('capturedImage')?.setValue(webcamImage.imageAsDataUrl);    
    // Send this image to the backend for processing
  }
  public handleInitError(error: WebcamInitError): void {
    console.error('Webcam initialization error:', error);
  }
  public clearImage(): void {
    this.form.get('bio')?.get('capturedImage')?.setValue(null);
    this.webcamImage = null;
  }

}
