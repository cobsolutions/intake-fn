import { Component, OnInit } from '@angular/core';
import { TrustDeviceToken } from '../../../models/trust.device/trust.device.token';
import { TrustDeviceService } from '../../../services/trust.device/trust-device.service';
import { SendTask, WebsocketService } from '../../../services/web.socket/websocket.service';

@Component({
  selector: 'generate-request',
  templateUrl: './generate-request.component.html',
  styleUrls: ['./generate-request.component.css']
})
export class GenerateRequestComponent implements OnInit {
  trustDeviceToken: TrustDeviceToken
  currentStep: number = 1;
  deviceName: string = '';
  inCorrectName: boolean = false;
  public createPatientURL: string
  public baseURL: string = location.origin
  minutes: number = 0;
  seconds: number = 0;
  expired: boolean = false;
  private intervalId: any;
  constructor(private trustDeviceService: TrustDeviceService,
    private websocketService:WebsocketService) { }

  ngOnInit(): void {
    
  }
  goToNextStep(): void {
    if (this.deviceName.trim() !== '') {
      this.trustDeviceService.generateDeviceRequest().subscribe((response: any) => {
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
    this.minutes = 0 ;
    this.seconds = 0 ;
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
