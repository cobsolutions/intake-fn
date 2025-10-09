import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { map, switchMap } from 'rxjs';
import { KcAuthServiceService } from 'src/app/modules/security/service/kc/kc-auth-service.service';
import { Survey } from '../../../models/create.survey/survey.model';
import { DigitalIntakeOneTimeTokenRequest } from '../../../models/one.time.token/digital.intake.one.time.token.request';
import { PatientMailRequest } from '../../../models/patient.channel/mail/patient.mail.request';
import { PatientSMSRequest } from '../../../models/patient.channel/sms/patient.sms.request';
import { ClinicService } from '../../../services/clinic/clinic.service';
import { PatientIntakeMailService } from '../../../services/mail/patient-intake-mail.service';
import { OneTimeTokenService } from '../../../services/one.time.token/one-time-token.service';
import { PatientIntakeSMSService } from '../../../services/sms/patient-intake-sms.service';
import { PatientSurveyService } from '../../../services/survey/patient-survey.service';

@Component({
  selector: 'request-quick-intake-submission',
  templateUrl: './request-quick-intake-submission.component.html',
  styleUrls: ['./request-quick-intake-submission.component.css']
})
export class RequestQuickIntakeSubmissionComponent implements OnInit {
  public baseURL: string = location.origin;
  intakeForm: FormGroup;

  clinics: any[] = [];
  surveys: Survey[];
  // Clinic selection options
  clinicSelectionOptions = [
    { value: 'specific', label: 'Select Clinic' },
    { value: 'all', label: 'All Clinics' },
    { value: 'none', label: 'None' }
  ];
  prepareURL: string
  isGenerated: boolean = false;
  constructor(private fb: FormBuilder,
    private kcAuthServiceService: KcAuthServiceService,
    private clinicService: ClinicService,
    private patientSurveyService: PatientSurveyService,
    private patientIntakeMailService: PatientIntakeMailService,
    private patientIntakeSMSService: PatientIntakeSMSService,
    private oneTimeTokenService: OneTimeTokenService,
    private toastrService: ToastrService) {
    this.intakeForm = this.fb.group({
      intakeType: ['', Validators.required],
      surveyType: [''],
      sendMethod: ['', Validators.required],
      clinicSelectionType: ['specific', Validators.required],
      selectedClinic: [null], // Single clinic ID
      patientEmail: [''],
      patientSMS: [''],
    });
  }

  ngOnInit() {
    // Watch for intake type changes to conditionally require survey type
    this.intakeForm.get('intakeType')?.valueChanges.subscribe(value => {
      const surveyTypeControl = this.intakeForm.get('surveyType');
      if (value === 'quick-survey') {
        surveyTypeControl?.setValidators([Validators.required]);
      } else {
        surveyTypeControl?.clearValidators();
      }
      surveyTypeControl?.updateValueAndValidity();
    });

    // Watch for clinic selection type changes
    this.intakeForm.get('clinicSelectionType')?.valueChanges.subscribe(value => {
      this.handleClinicSelectionTypeChange(value);
    });

    // Watch for send method changes to handle conditional validation
    this.intakeForm.get('sendMethod')?.valueChanges.subscribe(value => {
      this.handleSendMethodChange(value);
    });

    // Initialize clinic selection
    this.handleClinicSelectionTypeChange(this.intakeForm.get('clinicSelectionType')?.value);
    this.getClinics();
    this.getSurveys()
  }
  private getClinics() {
    var userId = this.kcAuthServiceService.getLoggedUser()?.sub;
    this.clinicService.getByUserId(userId).subscribe(response => {
      if (response.body?.length !== 0) {
        response.body?.forEach((element: any) => {
          this.clinics.push(element);
        });
      }
    })
  }
  private getSurveys() {
    this.patientSurveyService.getActive().pipe(
      map(data => data.body)
    )
      .subscribe((data: any) => {
        this.surveys = data
      })
  }
  selectIntakeType(type: string) {
    this.intakeForm.patchValue({ intakeType: type });
  }

  selectSendMethod(method: string) {
    this.intakeForm.patchValue({ sendMethod: method });
  }

  selectClinicSelectionType(type: string) {
    this.intakeForm.patchValue({
      clinicSelectionType: type,
      selectedClinic: null // Reset clinic selection when changing type
    });
    this.handleClinicSelectionTypeChange(type);
  }

  selectClinic(clinic: any) {
    if (this.isClinicSelectionTypeSelected('specific')) {
      this.intakeForm.patchValue({ selectedClinic: clinic.uuid });
    }
  }

  private handleClinicSelectionTypeChange(selectionType: string) {
    const selectedClinicControl = this.intakeForm.get('selectedClinic');

    switch (selectionType) {
      case 'specific':
        selectedClinicControl?.setValidators([Validators.required]);
        break;
      case 'all':
      case 'none':
        selectedClinicControl?.clearValidators();
        selectedClinicControl?.setValue(null);
        break;
    }

    selectedClinicControl?.updateValueAndValidity();
  }

  private handleSendMethodChange(sendMethod: string) {
    this.isGenerated = false;
    const patientEmailControl = this.intakeForm.get('patientEmail');
    const patientSMSControl = this.intakeForm.get('patientSMS');
    console.log(sendMethod)
    if (sendMethod === 'email') {
      patientEmailControl?.setValidators([Validators.required, Validators.email]);
    } else {
      patientEmailControl?.clearValidators();
      patientEmailControl?.setValue('');
    }
    if (sendMethod === 'sms') {
      patientSMSControl?.setValidators([Validators.required, Validators.pattern(/^\(\d{3}\) \d{3}-\d{4}$/)
      ]);
    } else {
      patientSMSControl?.clearValidators();
      patientSMSControl?.setValue('');
    }
    patientEmailControl?.updateValueAndValidity();
  }

  private buildDigitalIntakeOneTimeTokenRequest(requester: string): DigitalIntakeOneTimeTokenRequest {
    var request: DigitalIntakeOneTimeTokenRequest = {}
    if (this.getSubmitType()[0] === 'quick-survey')
      request = {
        clinicId: this.intakeForm.get('selectedClinic')?.value,
        requester: requester,
        type: 'QuickSurvey',
        surveyId: Number(this.getSubmitType()[1])
      }
    if (this.getSubmitType()[0] === 'quick')
      request = {
        clinicId: this.intakeForm.get('selectedClinic')?.value,
        requester: requester,
        type: 'Quick'
      }
    return request;
  }
  private getSubmitType(): string[] {
    var values: string[] = []
    var hasSurvey: string
    //Submit Type
    // [0] QuickIntake Or QuickIntake+Survey 
    // [1] Survey ID
    if ((this.intakeForm.get('surveyType')?.value !== undefined
      || this.intakeForm.get('surveyType')?.value !== null) && (this.intakeForm.get('surveyType')?.value.length === 0)) {
      hasSurvey = this.intakeForm.get('intakeType')?.value

      values[0] = this.intakeForm.get('intakeType')?.value;
    }
    else {
      values[0] = this.intakeForm.get('intakeType')?.value;
      values[1] = this.intakeForm.get('surveyType')?.value;
    }

    return values;
  }
  getSelectedClinic(): any | null {
    const selectedId = this.intakeForm.get('selectedClinic')?.value;
    return this.clinics.find(clinic => clinic.uuid === selectedId) || null;
  }

  isClinicSelected(clinic: any): boolean {
    return this.intakeForm.get('selectedClinic')?.value === clinic.uuid;
  }
  generateQRCode() {
    this.isGenerated = true;
    var request: DigitalIntakeOneTimeTokenRequest = this.buildDigitalIntakeOneTimeTokenRequest('Device_Submission')
    this.oneTimeTokenService.generateNew(request).subscribe((response: any) => {
      const ottResponse: any = response.body;
      this.prepareURL = this.baseURL + '/digital-intake/device-submission-request?token-id=' + ottResponse.tokenId;
      console.log(this.prepareURL)
    })
  }
  sendSMS() {
    if (this.intakeForm.valid && this.isSendMethodSelected('sms')) {
      const formValue = this.intakeForm.value;
      var request: DigitalIntakeOneTimeTokenRequest = this.buildDigitalIntakeOneTimeTokenRequest('SMS_Submission')
      request.phone = formValue.patientSMS;
      this.oneTimeTokenService.generateNew(request).pipe(
        switchMap((ootTokenResponse: any) => {
          const ottResponse: any = ootTokenResponse.body;
          var phoneRequest: PatientSMSRequest = {
            tokenId: ottResponse.tokenId,
            phone: formValue.patientSMS,
            type: 'Quick'
          }
          console.log(JSON.stringify(phoneRequest))
          return this.patientIntakeSMSService.send(phoneRequest)
        })
      ).subscribe(dd => {
        this.toastrService.success("Verification sms has been sent to patient")
      })

    }
  }
  sendEmail() {
    if (this.intakeForm.valid && this.isSendMethodSelected('email')) {
      const formValue = this.intakeForm.value;
      var request: DigitalIntakeOneTimeTokenRequest = this.buildDigitalIntakeOneTimeTokenRequest('Mail_Submission')
      request.mail = formValue.patientEmail;
      this.oneTimeTokenService.generateNew(request).pipe(
        switchMap((ootTokenResponse: any) => {
          const ottResponse: any = ootTokenResponse.body;
          var mailrequest: PatientMailRequest = {
            tokenId: ottResponse.tokenId,
            patientMail: formValue.patientEmail,
            type: 'Quick'
          }
          return this.patientIntakeMailService.send(mailrequest)
        })
      ).subscribe(dd => {
        this.toastrService.success("Verification mail has been sent to patient")
      })

      // Reset email-specific fields after sending
      this.intakeForm.patchValue({
        patientName: '',
        patientEmail: ''
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  cancel() {
    this.intakeForm.reset({
      clinicSelectionType: 'specific',
      sendMethod: ''
    });
    console.log('Form cancelled');
  }

  private markFormGroupTouched() {
    Object.keys(this.intakeForm.controls).forEach(key => {
      const control = this.intakeForm.get(key);
      control?.markAsTouched();
    });
  }

  // Helper methods for template
  isIntakeTypeSelected(type: string): boolean {
    return this.intakeForm.get('intakeType')?.value === type;
  }

  isSendMethodSelected(method: string): boolean {
    return this.intakeForm.get('sendMethod')?.value === method;
  }

  isClinicSelectionTypeSelected(type: string): boolean {
    return this.intakeForm.get('clinicSelectionType')?.value === type;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.intakeForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  isFieldRequired(fieldName: string): boolean {
    const field = this.intakeForm.get(fieldName);
    return !!(field && field.errors?.['required']);
  }

  isEmailInvalid(): boolean {
    const field = this.intakeForm.get('patientEmail');
    return !!(field && field.invalid && field.touched);
  }
  isSMSInvalid(): boolean {
    const field = this.intakeForm.get('patientSMS');
    return !!(field && field.invalid && field.touched);
  }

  // Clinic selection helpers
  isClinicSelectionRequired(): boolean {
    return this.intakeForm.get('clinicSelectionType')?.value === 'specific';
  }

  hasSelectedClinic(): boolean {
    return !!this.intakeForm.get('selectedClinic')?.value;
  }
  formatAddress(addr: any) {
    if (!addr) {
      return '';
    }

    // Extract state code if the value is like "NY - New York"
    const stateCode = addr.state ? addr.state.split('-')[0].trim() : '';

    const line1 = [addr.firstAddress, addr.secondAddress]
      .filter(Boolean) // removes undefined/empty
      .join(' ');

    const line2 = [addr.city, stateCode, addr.zipCode]
      .filter(Boolean)
      .join(' ');

    const country = addr.country ?? 'USA';

    return [line1, line2, country].filter(Boolean).join('\n');
  }
  canSelectSendMethod(): boolean {
    const intakeType = this.intakeForm.get('intakeType')?.value;
    const surveyType = this.intakeForm.get('surveyType')?.value;
    const location = this.intakeForm.get('selectedClinic')?.value;
    if (!intakeType) {
      return false; // must choose intake type first
    }

    if (intakeType === 'quick-survey' && !surveyType) {
      return false; // must choose survey type if survey selected
    }

    if (!location) {
      return false; // must choose clinic location
    }

    return true; // all good
  }
  getSendMethodErrorMessage(): string | null {
    const intakeType = this.intakeForm.get('intakeType')?.value;
    const surveyType = this.intakeForm.get('surveyType')?.value;
    const location = this.intakeForm.get('selectedClinic')?.value;

    const missing: string[] = [];

    if (!intakeType) {
      missing.push("Intake Type");
    }

    if (intakeType === "quick-survey" && !surveyType) {
      missing.push("Survey");
    }

    if (!location) {
      missing.push("Clinic");
    }

    if (missing.length === 0) {
      return null; // no error
    }

    if (missing.length === 1) {
      return `Please select ${missing[0]} before choosing a sending method.`;
    }

    if (missing.length === 2) {
      return `Please select ${missing[0]} and ${missing[1]} before choosing a sending method.`;
    }

    // 3 missing
    return `Please select ${missing[0]}, ${missing[1]}, and ${missing[2]} before choosing a sending method.`;
  }

}
