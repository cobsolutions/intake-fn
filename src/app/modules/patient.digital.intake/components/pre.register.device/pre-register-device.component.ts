import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { forkJoin, map, Observable, switchMap, tap } from 'rxjs';
import { DigitalIntakeDevice } from 'src/app/modules/patient.admin/models/trust.device/digital.intake.device';
import { DeviceLocation } from 'src/app/modules/patient.admin/models/trust.device/geolocation';
import { FingerprintService } from 'src/app/modules/patient.admin/services/trust.device/fingerprint.service';
import { DigitalIntakeService } from '../../services/digitalIntake/digital-intake.service';

@Component({
  selector: 'app-pre-register-device',
  templateUrl: './pre-register-device.component.html',
  styleUrls: ['./pre-register-device.component.css']
})
export class PreRegisterDeviceComponent implements OnInit {

  constructor(private digitalIntakeService: DigitalIntakeService
    , private route: ActivatedRoute
    , private fingerprintService: FingerprintService
    , private router: Router
    ,private cookieService:CookieService) { }
  digitalIntakeDevice: DigitalIntakeDevice
  isLoading: boolean = true
  token: string
  ngOnInit(): void {
    this.route.queryParams.subscribe((param: any) => {
      this.token = param['token-id'];
      const deviceName = param['name'];
      this._callGetFinderPrint().pipe(
        tap(terminalFingerPrint => {
          var location: DeviceLocation = {
            accuracy: 0,
            latitude: 0,
            longitude: 0
          }
          this.digitalIntakeDevice = {
            deviceName: deviceName,
            deviceId: terminalFingerPrint[0],
            geolocation: location,
          }
        }),
        switchMap(result => this.digitalIntakeService.registerDeviceA(this.digitalIntakeDevice))
      ).subscribe(result => {        
        this.router.navigate(['/digital-intake/register-finish']);
      })
    })
  }

  private _callGetFinderPrint(): Observable<any> {
    return this.fingerprintService.get()
  }

}
