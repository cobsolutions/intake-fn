import { Component, OnInit } from '@angular/core';
import { WebcamImage, WebcamInitError } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-cap',
  templateUrl: './cap.component.html',
  styleUrls: ['./cap.component.css']
})
export class CapComponent implements OnInit {
  public webcamImage: WebcamImage | null = null;
  private trigger: Subject<void> = new Subject<void>();
  constructor() { }

  ngOnInit(): void {
  }
  public triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }
  public captureImage(): void {
    this.trigger.next();
  }
  public handleImage(webcamImage: WebcamImage): void {
    this.webcamImage = webcamImage;
    console.log('Captured image', webcamImage);
    // Send this image to the backend for processing
  }
  public handleInitError(error: WebcamInitError): void {
    console.error('Webcam initialization error:', error);
  }
}
