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
    var request: DigitalIntakeOneTimeTokenRequest = {
      clinicId: this.selectedClinicUUID,
      requester: 'Device_Submission'
    }
    this.oneTimeTokenService.generate(request).subscribe((response: any) => {
      const requestToken: any = response.body;
      this.submissionURL = this.baseURL + '/digital-intake/pre-create?token=' + requestToken.token;;
      this.isGenerated = true
    })

  }

}
