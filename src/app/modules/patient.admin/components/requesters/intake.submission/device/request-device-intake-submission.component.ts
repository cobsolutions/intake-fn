import { Component, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { DigitalIntakeOneTimeTokenRequest } from 'src/app/modules/patient.admin/models/one.time.token/digital.intake.one.time.token.request';
import { ClinicService } from 'src/app/modules/patient.admin/services/clinic/clinic.service';
import { OneTimeTokenService } from 'src/app/modules/patient.admin/services/one.time.token/one-time-token.service';

@Component({
  selector: 'request-device-intake-submission',
  templateUrl: './request-device-intake-submission.component.html',
  styleUrls: ['./request-device-intake-submission.component.css']
})
export class RequestDeviceIntakeSubmissionComponent implements OnInit {
  public baseURL: string = location.origin;
  clinics$: Observable<any>
  selectedClinicUUID: string | undefined = undefined
  submissionURL: string
  isGenerated: boolean = false;
  isValid: boolean = true
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
      var request: DigitalIntakeOneTimeTokenRequest = {
        clinicId: this.selectedClinicUUID,
        requester: 'Device_Submission',
        type: 'Full'
      }
      this.oneTimeTokenService.generateNew(request).subscribe((response: any) => {
        console.log(response.body)
        const ottResponse: any = response.body;
        this.submissionURL = this.baseURL + '/digital-intake/device-submission-request?token-id=' + ottResponse.tokenId;
        this.isGenerated = true
        console.log(this.submissionURL)
      })
    } else {
      this.isValid = false;
    }

  }

}
