import { Component, OnInit } from '@angular/core';
import { TrustDeviceToken } from '../../../models/trust.device/trust.device.token';
import { FingerprintService } from '../../../services/trust.device/fingerprint.service';
import { TrustDeviceService } from '../../../services/trust.device/trust-device.service';

@Component({
  selector: 'generate-request',
  templateUrl: './generate-request.component.html',
  styleUrls: ['./generate-request.component.css']
})
export class GenerateRequestComponent implements OnInit {
  trustDeviceToken: TrustDeviceToken
  currentStep: number = 1;
  deviceName: string = '';
  constructor(private trustDeviceService: TrustDeviceService, private fingerprintService: FingerprintService) { }

  ngOnInit(): void {
    this.fingerprintService.get().subscribe(re => {
      console.log(re)
    })
    // this.trustDeviceService.generateDeviceRequest().subscribe((token: any) => {
    //   console.log(token)
    //   this.trustDeviceToken = token;
    // })
  }
  goToNextStep(): void {
    if (this.deviceName.trim() !== '') {
      this.currentStep = 2;
    } else {
      alert('Please enter a device name');
    }
  }
  goTopreviousStep(): void {
    this.currentStep = 1;
  }
}
