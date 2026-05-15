import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientSMSRequest } from 'src/app/modules/patient.admin/models/patient.channel/sms/patient.sms.request';
import { DigitalIntakeService } from '../../services/digitalIntake/digital-intake.service';

@Component({
  selector: 'app-sms-verification',
  templateUrl: './sms-verification.component.html',
  styleUrls: ['./sms-verification.component.css']
})
export class SmsVerificationComponent implements OnInit {
  isLoading: boolean = true
  constructor(private route: ActivatedRoute,
    private digitalIntakeService: DigitalIntakeService,
    private router: Router) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(param => {
      const tokenId = param['token-id'];
      const patientPhone = param['p'];
      const patientsmsRequest: PatientSMSRequest = {
        tokenId: tokenId,
        phone: patientPhone
      }
      this.digitalIntakeService.verfiySMS(patientsmsRequest).subscribe((response: any) => {
        this.isLoading = false
        const submissionType: string = response.body.result;
        switch (submissionType) {
          case 'Quick':
          case 'QuickSurvey':
            this.router.navigate(['/digital-intake/quick/patient-sms-create-request'], {
              queryParams: {
                'token-id': tokenId
              }
            });
            break;
        }
      })
    })
  }

}
