import { Component, OnInit } from '@angular/core';
import { filter, map, Observable, switchMap, tap } from 'rxjs';
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
export class RequestDeviceRegistrationComponent implements OnInit {
  clinics$: Observable<any>
  trustDeviceToken: TrustDeviceToken
  currentStep: number = 1;
  deviceName: string = '';
  inCorrectName: boolean = false;
  inClinic: boolean = false;
  public createPatientURL: string
  public baseURL: string = location.origin
  minutes: number = 0;
  seconds: number = 0;
  expired: boolean = false;
  private intervalId: any;
  selectedClinicUUID: string | undefined = undefined
  constructor(private oneTimeTokenService: OneTimeTokenService,
    private clinicService: ClinicService,
    private websocketService: WebsocketService) { }

  ngOnInit(): void {
    this.getAllClinics()
  }
  private getAllClinics() {
    this.clinics$ = this.clinicService.get().pipe(
      map(result => result.body)
    )
  }
  goToNextStep(): void {
    if (this.deviceName.trim() !== '') {
      var request: DigitalIntakeOneTimeTokenRequest = {
        expiryPeriod: 60000,
        requester: 'Device_Registration',
        clinicId: this.selectedClinicUUID
      }
      this.oneTimeTokenService.generate(request)
        .subscribe((response: any) => {
          const requestToken: any = response.body;
          this.createPatientURL = this.baseURL + '/scanner?name=' + this.deviceName + '&token=' + requestToken.token;
          console.log(this.createPatientURL)
          this.currentStep = 2;
          this.inCorrectName = false
          this.startCountdown(requestToken.expiresAt);
        })
    } else {
      this.inCorrectName = true;
    }

  }
  goTopreviousStep(): void {
    this.currentStep = 1;
    this.minutes = 0;
    this.seconds = 0;
    this.clearExistingInterval();
  }
  startCountdown(expiryDate: number): void {
    this.intervalId = setInterval(() => {
      const now = Date.now();
      const timeRemaining = expiryDate - now;

      if (timeRemaining <= 0) {
        this.expired = true;
        clearInterval(this.intervalId);
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
      this.intervalId = null; // Reset the interval ID
    }
  }

}
