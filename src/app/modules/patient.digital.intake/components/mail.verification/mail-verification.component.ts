import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientMailRequest } from 'src/app/modules/patient.admin/models/patient.channel/mail/patient.mail.request';
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
      this.digitalIntakeService.verfiyMail(patientMailRequest).subscribe((response: any) => {
        this.isLoading = false
        const submissionType: string = response.body.result
        switch (submissionType) {
          case 'Full':
            this.router.navigate(['/digital-intake/patient-mail-create-request'], {
              queryParams: {
                'token-id': tokenId
              }
            });
            break;
          case 'Quick':
          case 'QuickSurvey':
            this.router.navigate(['/digital-intake/quick/patient-mail-create-request'], {
              queryParams: {
                'token-id': tokenId
              }
            });
            break;
        }
      })
    })
  }
  goToLink(url: string) {
    console.log(url)
    window.open(url, "_self");
  }

}
