import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, switchMap } from 'rxjs';
import { PatientMailRequest } from 'src/app/modules/patient.admin/models/patient.mail/patient.mail.request';
import { FingerprintService } from 'src/app/modules/patient.admin/services/trust.device/fingerprint.service';
import { DigitalIntakeService } from '../../services/digitalIntake/digital-intake.service';

@Component({
  selector: 'app-mail-verification',
  templateUrl: './mail-verification.component.html',
  styleUrls: ['./mail-verification.component.css']
})
export class MailVerificationComponent implements OnInit {
  isLoading: boolean = true
  constructor(private route: ActivatedRoute,
    private digitalIntakeService: DigitalIntakeService,
    private router: Router) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(param => {

      const tokenId = param['token-id'];
      const patientMail = param['m'];
      const patientMailRequest: PatientMailRequest = {
        patientMail: patientMail,
        tokenId: tokenId
      }
      this.digitalIntakeService.verfiyMail(patientMailRequest).subscribe(dd => {
        this.isLoading = false
        this.router.navigate(['/digital-intake/patient-mail-create-request'], {
          queryParams: {
            'token-id': tokenId
          }
        });
      })
    })
  }
  goToLink(url: string) {
    console.log(url)
    window.open(url, "_self");
  }

}
