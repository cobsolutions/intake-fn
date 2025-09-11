import { Component, Input, OnInit } from '@angular/core';
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
  isValid: boolean = true;
  isEmptyClinic: boolean = true;
  isEmptyMail: boolean = true;
  isNotMail: boolean = true;
  errorMessageClinic: string | undefined;
  errorMessageMail: string | undefined;
  errorMessageMailFormat: string | undefined;
  @Input() type: string;
  @Input() surveyId:number
  @Input() patientId:number
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
    this.validate()
    if (this.validate()) {
      var request: DigitalIntakeOneTimeTokenRequest = {
        clinicId: this.selectedClinicUUID,
        expiryPeriod: 1800000,
        requester: 'Mail_Submission',
        type:this.type,
        surveyId:this.surveyId,
        patientId:this.patientId
      }
      this.oneTimeTokenService.generatePatientMailToken(request, this.patientEmail).subscribe((response: any) => {
        this.toastrService.success("Verification mail has been sent to patient")
        this.isSent = true;
        const requestToken: any = response.body;
        this.verificationLink = this.baseURL + '/digital-intake/verfiy/mail?token=' + requestToken.token;
        this.router.navigateByUrl('admin/patient/create');
        // const url = 'admin/patient/create'
        // this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        //   this.router.navigate([`/${url}`]).then(() => { })
        // })
      })
    }
  }
  private validateEmail(email: string) {
    if (email) {
      const forbidden = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g.test(email);
      return !forbidden ? false : true;
    } else
      return true;
  }
  private validate(): boolean {
    if (this.selectedClinicUUID === undefined) {
      this.isEmptyClinic = true;
      this.errorMessageClinic = "Select Clinic to send digital intake.";
    } else {
      this.isEmptyClinic = false;
    }
    if (this.patientEmail === undefined || this.patientEmail === '') {
      this.isEmptyMail = true;
      this.errorMessageMail = "Select Email to send digital intake.";
    } else {
      this.isEmptyMail = false;
    }
    if (!this.validateEmail(this.patientEmail!)) {
      this.isNotMail = true;
      this.errorMessageMailFormat = "Invalid email. Please check the entered email address format.";
    } else {
      this.isNotMail = false;
    }
    return !this.isEmptyMail && !this.isEmptyClinic && !this.isNotMail;
  }
}
