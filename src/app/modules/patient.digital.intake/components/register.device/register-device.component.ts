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
    private cookieService:CookieService
  ) { }

  ngOnInit(): void {
    // this.digitalIntakeService.registerDevice()
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      const digitalIntakeDevice = JSON.parse(params['digitalIntakeDevice'])
      this.digitalIntakeService.registerDevice(digitalIntakeDevice, token).subscribe(result => {
        this.isLoading = false;
        this.error = false;
        this.errorMessage = undefined;
      }, error => {
        this.isLoading = false;
        this.error = true
        if (error.error !== undefined)
          this.errorMessage = error.error.message;
        console.log(error)
      })
    });
  }

}
