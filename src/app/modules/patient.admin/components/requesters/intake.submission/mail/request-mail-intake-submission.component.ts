import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { map, Observable } from 'rxjs';
import { DigitalIntakeOneTimeTokenRequest } from 'src/app/modules/patient.admin/models/one.time.token/digital.intake.one.time.token.request';
import { ClinicService } from 'src/app/modules/patient.admin/services/clinic/clinic.service';
import { OneTimeTokenService } from 'src/app/modules/patient.admin/services/one.time.token/one-time-token.service';

@Component({
  selector: 'request-mail-intake-submission',
  templateUrl: './request-mail-intake-submission.component.html',
  styleUrls: ['./request-mail-intake-submission.component.css']
})
export class RequestMailIntakeSubmissionComponent implements OnInit {
  clinics$: Observable<any>
  selectedClinicUUID: string | undefined = undefined
  patientEmail: string | undefined = undefined
  private baseURL: string = location.origin
  private verificationLink: string;
  constructor(private clinicService: ClinicService,
    private oneTimeTokenService: OneTimeTokenService,
    private router: Router,
    private toastrService: ToastrService) { }
  isSent: boolean = false
  ngOnInit(): void {
    this.getAllClinics()
  }
  private getAllClinics() {
    this.clinics$ = this.clinicService.get().pipe(
      map(result => result.body)
    )
  }
  send() {
    this.isSent = true;
    var request: DigitalIntakeOneTimeTokenRequest = {
      clinicId: this.selectedClinicUUID,
      expiryPeriod: 1800000,
      requester:'Mail_Submission'
    }
    this.oneTimeTokenService.generatePatientMailToken(request, this.patientEmail).subscribe((response: any) => {
      this.toastrService.success("Verification mail has been sent to patient")
      this.isSent = true;
      const requestToken: any = response.body;
      this.verificationLink = this.baseURL + '/digital-intake/verfiy/mail?token=' + requestToken.token;
      this.router.navigateByUrl('admin/patient/create');
      const url = 'admin/patient/create'
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([`/${url}`]).then(() => { })
      })
    })
  }

}
