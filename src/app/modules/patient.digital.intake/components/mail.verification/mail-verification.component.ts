import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, switchMap } from 'rxjs';
import { FingerprintService } from 'src/app/modules/patient.admin/services/trust.device/fingerprint.service';
import { DigitalIntakeService } from '../../services/digitalIntake/digital-intake.service';

@Component({
  selector: 'app-mail-verification',
  templateUrl: './mail-verification.component.html',
  styleUrls: ['./mail-verification.component.css']
})
export class MailVerificationComponent implements OnInit {
  isLoading = true;
  error: boolean = false;
  errorMessage: string | undefined;
  constructor(private route: ActivatedRoute, private fingerprintService: FingerprintService, private digitalIntakeService: DigitalIntakeService) { }

  ngOnInit(): void {
    const _getDeviceId = this.fingerprintService.getDeviceId();
    this.route.queryParams.subscribe(param => {
      const toekn = param['token'];
      _getDeviceId.pipe(
        switchMap(deviceId => this.digitalIntakeService.verifyMail(toekn, deviceId))
      ).subscribe(rre => {
        this.isLoading = false;
      })
    })

  }

}
