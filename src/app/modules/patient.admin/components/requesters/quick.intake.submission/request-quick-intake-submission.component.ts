import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { map } from 'rxjs';
import { KcAuthServiceService } from 'src/app/modules/security/service/kc/kc-auth-service.service';
import { Survey } from '../../../models/create.survey/survey.model';
import { QuickIntakeRequest } from '../../../models/quick.intake/quickIntake.request';
import { ClinicService } from '../../../services/clinic/clinic.service';
import { QuickIntakeService } from '../../../services/quick.intake/quick-intake.service';
import { PatientSurveyService } from '../../../services/survey/patient-survey.service';

@Component({
  selector: 'request-quick-intake-submission',
  templateUrl: './request-quick-intake-submission.component.html',
  styleUrls: ['./request-quick-intake-submission.component.css']
})
export class RequestQuickIntakeSubmissionComponent implements OnInit {

  intakeForm: FormGroup;

  clinics: any[] = [];
  surveys: Survey[];
  // Clinic selection options
  clinicSelectionOptions = [
    { value: 'specific', label: 'Select Clinic' },
    { value: 'all', label: 'All Clinics' },
    { value: 'none', label: 'None' }
  ];
  // Fixed QR Code data (you can replace this with actual QR code generation)
  qrCodeData = 'https://your-clinic-portal.com/tablet-intake/12345';

  constructor(private fb: FormBuilder,
    private kcAuthServiceService: KcAuthServiceService,
    private clinicService: ClinicService,
    private patientSurveyService: PatientSurveyService,
    private quickIntakeService: QuickIntakeService) {
    this.intakeForm = this.fb.group({
      intakeType: ['', Validators.required],
      surveyType: [''],
      sendMethod: ['', Validators.required],
      clinicSelectionType: ['specific', Validators.required],
      selectedClinic: [null], // Single clinic ID
      patientEmail: [''],
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
    const patientEmailControl = this.intakeForm.get('patientEmail');

    if (sendMethod === 'email') {
      patientEmailControl?.setValidators([Validators.required, Validators.email]);
      this.constructURL('mail')
    } else {
      patientEmailControl?.clearValidators();
      patientEmailControl?.setValue('');
      this.constructURL('device')
    }
    patientEmailControl?.updateValueAndValidity();
  }

  private constructURL(type: string) {
    var quickIntakeRequest: QuickIntakeRequest = {}
    switch (type) {
      case 'mail':
        quickIntakeRequest.requester = 'Mail_Submission'
        quickIntakeRequest.requestMetaData = {};
        break;
      case 'device':
        quickIntakeRequest.requester = 'Device_Submission'
        quickIntakeRequest.requestMetaData = {};
        break
    }
    this.quickIntakeService.generateOTT(quickIntakeRequest).subscribe(ott => {
      console.log(JSON.stringify(ott))
    })
  }

  getSelectedClinic(): any | null {
    const selectedId = this.intakeForm.get('selectedClinic')?.value;
    return this.clinics.find(clinic => clinic.uuid === selectedId) || null;
  }

  isClinicSelected(clinic: any): boolean {
    return this.intakeForm.get('selectedClinic')?.value === clinic.uuid;
  }

  sendEmail() {
    if (this.intakeForm.valid && this.isSendMethodSelected('email')) {
      const formValue = this.intakeForm.value;
      const selectedClinic = this.getSelectedClinic();

      const emailData = {
        patientEmail: formValue.patientEmail,
        intakeType: formValue.intakeType,
        surveyType: formValue.surveyType,
        clinic: selectedClinic,
        isAllClinics: formValue.clinicSelectionType === 'all',
        isNoClinics: formValue.clinicSelectionType === 'none'
      };

      console.log('Sending email with data:', emailData);
      alert(`Email sent to ${formValue.patientName} at ${formValue.patientEmail}`);

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
}
