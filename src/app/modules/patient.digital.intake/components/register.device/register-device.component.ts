import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { map, switchMap } from 'rxjs';
import { DigitalIntakeDevice } from 'src/app/modules/patient.admin/models/trust.device/digital.intake.device';
import { DeviceLocation } from 'src/app/modules/patient.admin/models/trust.device/geolocation';
import { FingerprintService } from 'src/app/modules/patient.admin/services/trust.device/fingerprint.service';
import { WebsocketService } from 'src/app/modules/patient.admin/services/web.socket/websocket.service';
import { DigitalIntakeService } from '../../services/digitalIntake/digital-intake.service';

@Component({
  selector: 'register-device',
  templateUrl: './register-device.component.html',
  styleUrls: ['./register-device.component.css']
})
export class RegisterDeviceComponent implements OnInit {
  isLoading = true;
  error: boolean = false;
  errorMessage: string | undefined;
  deviceId: string;
  constructor(private digitalIntakeService: DigitalIntakeService,
    private fingerprintService: FingerprintService,
    private route: ActivatedRoute,
    private websocketService: WebsocketService,
    private cookieService:CookieService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(param => {

      this.fingerprintService.get().pipe(
        map(result => {
          var location: DeviceLocation = {
            accuracy: result[0].coords.accuracy,
            latitude: result[0].coords.latitude,
            longitude: result[0].coords.longitude
          }
          var digitalIntakeDevice: DigitalIntakeDevice = {
            deviceName: param['name'],
            deviceId: result[1],
            geolocation: location,
          }
          return digitalIntakeDevice
        })
        , switchMap((digitalIntakeDevice: any) => this.digitalIntakeService.registerDevice(digitalIntakeDevice, param['token']))
      ).subscribe((respose: any) => {
        const digitalIntakeDevice :DigitalIntakeDevice = respose.body
        this.isLoading = false;
        this.error = false;
        this.errorMessage = undefined;
        //temp set device-Id cookie to be catched in guard regarding device check
        this.cookieService.set('device-id', digitalIntakeDevice.deviceId, 3650, '/digital-intake')
        //this.websocketService.send(respose.body)
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
