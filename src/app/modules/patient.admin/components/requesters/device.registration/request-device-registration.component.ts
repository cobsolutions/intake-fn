import { Component, OnDestroy, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { DigitalIntakeOneTimeTokenRequest } from '../../../models/one.time.token/digital.intake.one.time.token.request';
import { TrustDeviceToken } from '../../../models/trust.device/trust.device.token';
import { ClinicService } from '../../../services/clinic/clinic.service';
import { OneTimeTokenService } from '../../../services/one.time.token/one-time-token.service';
import { WebsocketService } from '../../../services/web.socket/websocket.service';

@Component({
  selector: 'request-device-registration',
  templateUrl: './request-device-registration.component.html',
  styleUrls: ['./request-device-registration.component.css']
})
export class RequestDeviceRegistrationComponent implements OnInit, OnDestroy {
  clinics$: Observable<any>;
  trustDeviceToken: TrustDeviceToken;
  currentStep: number = 1;
  deviceName: string = '';
  inCorrectName: boolean = false;
  inClinic: boolean = false;
  public createPatientURL: string;
  public baseURL: string = location.origin;
  minutes: number = 0;
  seconds: number = 0;
  expired: boolean = false;
  isGenerating: boolean = false;
  private intervalId: any;
  selectedClinicUUID: string | undefined = undefined;

  constructor(private oneTimeTokenService: OneTimeTokenService,
    private clinicService: ClinicService,
    private websocketService: WebsocketService) { }

  ngOnInit(): void {
    this.getAllClinics();
  }

  ngOnDestroy(): void {
    this.clearExistingInterval();
  }

  private getAllClinics() {
    this.clinics$ = this.clinicService.get().pipe(
      map(result => result.body)
    );
  }

  goToNextStep(): void {
    if (this.deviceName.trim() === '') {
      this.inCorrectName = true;
      return;
    }
    this.inCorrectName = false;
    this.isGenerating = true;
    this.expired = false;

    const request: DigitalIntakeOneTimeTokenRequest = {
      clinicId: this.selectedClinicUUID,
      requester: 'Registration'
    };
    this.oneTimeTokenService.generateNew(request).subscribe({
      next: (response: any) => {
        const ottResponse: any = response.body;
        this.createPatientURL = this.baseURL + '/digital-intake/register-request?name=' + encodeURIComponent(this.deviceName) + '&token-id=' + ottResponse.tokenId;
        this.currentStep = 2;
        this.isGenerating = false;
        this.startCountdown(ottResponse.expiresAt);
      },
      error: () => {
        this.isGenerating = false;
      }
    });
  }

  goTopreviousStep(): void {
    this.currentStep = 1;
    this.minutes = 0;
    this.seconds = 0;
    this.expired = false;
    this.clearExistingInterval();
  }

  startCountdown(expiryDate: number): void {
    this.clearExistingInterval();
    this.intervalId = setInterval(() => {
      const now = Date.now();
      const timeRemaining = expiryDate - now;

      if (timeRemaining <= 0) {
        this.expired = true;
        this.minutes = 0;
        this.seconds = 0;
        this.clearExistingInterval();
      } else {
        const totalSeconds = Math.floor(timeRemaining / 1000);
        this.minutes = Math.floor(totalSeconds / 60);
        this.seconds = totalSeconds % 60;
      }
    }, 1000);
  }

  clearExistingInterval(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  get secondsPadded(): string {
    return this.seconds.toString().padStart(2, '0');
  }
}
