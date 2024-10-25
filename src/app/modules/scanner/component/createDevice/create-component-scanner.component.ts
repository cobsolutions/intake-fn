import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { DeviceInformation } from 'src/app/modules/patient.admin/models/trust.device/device.information';
import { DeviceTokenRequest } from 'src/app/modules/patient.admin/models/trust.device/device.token.request';
import { DeviceLocation } from 'src/app/modules/patient.admin/models/trust.device/geolocation';
import { FingerprintService } from 'src/app/modules/patient.admin/services/trust.device/fingerprint.service';
import { TrustDeviceService } from 'src/app/modules/patient.admin/services/trust.device/trust-device.service';

@Component({
  selector: 'create-component-scanner',
  templateUrl: './create-component-scanner.component.html',
  styleUrls: ['./create-component-scanner.component.css']
})
export class CreateComponentScannerComponent implements OnInit {
  isLoading = true;
  error:boolean= false;
  errorMessage:string|undefined;
  constructor(private trustDeviceService: TrustDeviceService, private fingerprintService: FingerprintService, private route: ActivatedRoute) { }
  ngOnInit(): void {
    this.route.queryParams.subscribe(param => {

      this.fingerprintService.get().pipe(
        map(result => {
          var location: DeviceLocation = {
            accuracy: result[0].coords.accuracy,
            latitude: result[0].coords.latitude,
            longitude: result[0].coords.longitude
          }
          var deviceInformation: DeviceInformation = {
            deviceName: param['name'],
            deviceId: result[1],
            geolocation: location
          }
          var deviceTokenRequest: DeviceTokenRequest = {
            token: param['token'],
            deviceInformation: deviceInformation
          }
          return deviceTokenRequest
        }), switchMap(deviceRequestToken => 
          this.trustDeviceService.registerDevice(deviceRequestToken))
      ).subscribe(() => {
        this.isLoading = false;
        this.error =false;
        this.errorMessage = undefined;
      },error=>{
        this.isLoading = false;
        this.error =true
        this.errorMessage= error.error.message.replace(/\b[a-zA-Z0-9-]+\b/, 'QR code');
      })
    }
    )
  }
}
