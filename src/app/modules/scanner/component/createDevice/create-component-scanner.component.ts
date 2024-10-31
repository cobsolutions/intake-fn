import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { map, switchMap } from 'rxjs';
import { DeviceInformation } from 'src/app/modules/patient.admin/models/trust.device/device.information';
import { DeviceTokenRequest } from 'src/app/modules/patient.admin/models/trust.device/device.token.request';
import { DeviceLocation } from 'src/app/modules/patient.admin/models/trust.device/geolocation';
import { FingerprintService } from 'src/app/modules/patient.admin/services/trust.device/fingerprint.service';
import { TrustDeviceService } from 'src/app/modules/patient.admin/services/trust.device/trust-device.service';
import { WebsocketService } from 'src/app/modules/patient.admin/services/web.socket/websocket.service';

@Component({
  selector: 'create-component-scanner',
  templateUrl: './create-component-scanner.component.html',
  styleUrls: ['./create-component-scanner.component.css']
})
export class CreateComponentScannerComponent implements OnInit {
  isLoading = true;
  error: boolean = false;
  errorMessage: string | undefined;
  deviceId: string;
  constructor(private trustDeviceService: TrustDeviceService,
    private fingerprintService: FingerprintService,
    private route: ActivatedRoute,
    private cookieService: CookieService,
    private websocketService: WebsocketService) { }
  ngOnInit(): void {
    this.route.queryParams.subscribe(param => {

      this.fingerprintService.get().pipe(
        map(result => {
          this.deviceId = result[1]
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
            clinicId: param['clinicId'],
            deviceInformation: deviceInformation
          }
          return deviceTokenRequest
        }), switchMap(deviceRequestToken =>
          this.trustDeviceService.registerDevice(deviceRequestToken))
      ).subscribe((respose: any) => {
        this.isLoading = false;
        this.error = false;
        this.errorMessage = undefined;
        this.cookieService.set('device-id', this.deviceId, 3650, '/digital-intake')
        this.websocketService.send(respose.body)
      }, error => {
        this.isLoading = false;
        this.error = true
        if (error.error !== undefined)
          this.errorMessage = error.error.message;
        console.log(error)
      })
    }
    )
  }
}
