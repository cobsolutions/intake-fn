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
  status: string
  digitalIntakeURL: string;
  public baseURL: string = location.origin;
  constructor(private route: ActivatedRoute, private fingerprintService: FingerprintService, private digitalIntakeService: DigitalIntakeService) { }

  ngOnInit(): void {
    const _getDeviceId = this.fingerprintService.getDeviceId();
    this.route.queryParams.subscribe(param => {
      const token = param['token'];
      const type = param['type'];
      const surveyId = param['surveyId'];
      const patientId = param['patientId'];
      console.log('TTTTT ' + type)
      _getDeviceId.pipe(
        switchMap(deviceId => this.digitalIntakeService.verifyMail(token, deviceId)),
        switchMap(result => this.digitalIntakeService.initDigitalIntakeRecord("Mail"))
      ).subscribe(rre => {
        this.status = 'V'
        console.log('MailVerificationComponent + type ' + type)
        if (type === 'FI')
          this.digitalIntakeURL = this.baseURL + '/digital-intake/submit?token=' + token + "&type=" + type;
        if (type === 'QI')
          this.digitalIntakeURL = this.baseURL + '/digital-intake/submit-quick-create-intake-survey?token=' + token
            + "&type=" + type
            + "&surveyId=" + surveyId
            + "&patientId=" + patientId;
        if (type === 'S')
          this.digitalIntakeURL = this.baseURL + '/digital-intake/submit-create-survey?token=' + token + "&type=" + type + "&surveyId=" + surveyId + "&patientId=" + patientId;
        console.log(this.digitalIntakeURL)
      }, error => {
        this.status = 'E'
      })
    })
  }
  goToLink(url: string) {
    console.log(url)
    window.open(url, "_self");
  }

}
