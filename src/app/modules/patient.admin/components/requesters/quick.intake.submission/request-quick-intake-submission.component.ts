import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'request-quick-intake-submission',
  templateUrl: './request-quick-intake-submission.component.html',
  styleUrls: ['./request-quick-intake-submission.component.css']
})
export class RequestQuickIntakeSubmissionComponent implements OnInit {

  intakeForm: FormGroup;
  
  clinics: any[] = [
    { id: 1, name: 'Downtown Medical Center', address: '123 Main St, Cityville' },
    { id: 2, name: 'Northside Clinic', address: '456 Oak Ave, Townsville' },
    { id: 3, name: 'Westend Health Hub', address: '789 Pine Rd, Villagetown' },
    { id: 4, name: 'Eastwood Family Practice', address: '321 Elm St, Borough City' },
    { id: 5, name: 'Central Community Hospital', address: '654 Maple Dr, Metro City' }
  ];

  // Clinic selection options
  clinicSelectionOptions = [
    { value: 'specific', label: 'Select Clinic' },
    { value: 'all', label: 'All Clinics' },
    { value: 'none', label: 'None' }
  ];
// Fixed QR Code data (you can replace this with actual QR code generation)
qrCodeData = 'https://your-clinic-portal.com/tablet-intake/12345';

constructor(private fb: FormBuilder) {
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
    this.intakeForm.patchValue({ selectedClinic: clinic.id });
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
  } else {
    patientEmailControl?.clearValidators();
    patientEmailControl?.setValue('');
  }
  patientEmailControl?.updateValueAndValidity();
}

getSelectedClinic(): any | null {
  const selectedId = this.intakeForm.get('selectedClinic')?.value;
  return this.clinics.find(clinic => clinic.id === selectedId) || null;
}

isClinicSelected(clinic: any): boolean {
  return this.intakeForm.get('selectedClinic')?.value === clinic.id;
}

sendEmail() {
  if (this.intakeForm.valid && this.isSendMethodSelected('email')) {
    const formValue = this.intakeForm.value;
    const selectedClinic = this.getSelectedClinic();
    
    const emailData = {
      patientName: formValue.patientName,
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
}
