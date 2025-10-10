import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { FingerprintService } from 'src/app/modules/patient.admin/services/trust.device/fingerprint.service';
import { WebsocketService } from 'src/app/modules/patient.admin/services/web.socket/websocket.service';
import { DigitalIntakeOTTService } from 'src/app/modules/security/service/digital.intake.ott.service/digital-intake-ott.service';
import { DigitalIntakeService } from '../../services/digitalIntake/digital-intake.service';

@Component({
  selector: 'register-device',
  templateUrl: './register-device.component.html',
  styleUrls: ['./register-device.component.css']
})
export class RegisterDeviceComponent implements OnInit {
  isLoading = true;
  constructor(private digitalIntakeOTTService:DigitalIntakeOTTService) { }

  ngOnInit(): void {
    this.isLoading = false
    this.digitalIntakeOTTService.evictToken()
  }

}
