import { Component, Input, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ClinicService } from '../../../services/clinic/clinic.service';
import { OneTimeTokenService } from '../../../services/one.time.token/one-time-token.service';

@Component({
  selector: 'request-device-survey-submission-component',
  templateUrl: './request-device-survey-submission-component.component.html',
  styleUrls: ['./request-device-survey-submission-component.component.css']
})
export class RequestDeviceSurveySubmissionComponentComponent implements OnInit {
  submissionApproach: string | undefined = undefined
  public baseURL: string = location.origin;
  clinics$: Observable<any>
  selectedClinicUUID: string | undefined = undefined
  submissionURL: string
  isGenerated: boolean = false;
  isValid: boolean = true
  @Input() suryveyId: number;
  @Input() patientId: number
  constructor(private clinicService: ClinicService, private oneTimeTokenService: OneTimeTokenService) { }

  ngOnInit(): void {
    this.getAllClinics()
  }
  private getAllClinics() {
    this.clinics$ = this.clinicService.get().pipe(
      map(result => result.body)
    )
  }
  generateQRCode() {
    if (this.selectedClinicUUID !== undefined) {
      this.isValid = true
      var request: any = {
        clinicId: this.selectedClinicUUID,
        requester: 'Device_Submission'
      }
      this.oneTimeTokenService.generate(request).subscribe((response: any) => {
        const requestToken: any = response.body;
        this.submissionURL = this.baseURL + '/digital-intake/pre-create-survey?token=' + requestToken.token + '&suryveyId=' + this.suryveyId + '&patientId=' + this.patientId;
        this.isGenerated = true
        console.log(this.submissionURL)
      })
    } else {
      this.isValid = false;
    }
  }
}
