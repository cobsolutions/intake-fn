import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { DigitalIntakeService } from '../../services/digitalIntake/digital-intake.service';
import { EmailValidator } from './validators/custom.validation/email.validator';
import { futureDateValidator } from './validators/custom.validation/future.date.validator';
import { maxDateValidator } from './validators/custom.validation/max.date.validator';
import { noNumbersValidator } from './validators/custom.validation/no.number.validator';
import { noSpecialCharactersValidator } from './validators/custom.validation/special.characters.validator';
import { todayDOBValidator } from './validators/custom.validation/today.dob.validator';
import { GuarantorValidator } from './validators/guarantor/guarantor.validator';
import { InsuranceValidator } from './validators/insurance/insurance.validator';
import { PrescriptionValidator } from './validators/medical.history/add.prescription.validator';
import { AddSurgerisListValidator } from './validators/medical.history/add.surgeries.list';
import { XRayValidator } from './validators/medical.history/add.xray.validator';
import { ConditionsValidator } from './validators/medical.history/conditions.validator';
import { PatientSourceValidator } from './validators/patient.source/patient.source.validator';

type IntakeSectionKey = 'welcome' | 'about' | 'health' | 'coverage' | 'confirm';

interface IntakeSection {
  key: IntakeSectionKey;
  label: string;
}

interface IntakeStepMeta {
  key: string;
  label: string;
  title: string;
  hint: string;
  icon: string;
  section: IntakeSectionKey;
}

@Component({
  selector: 'app-create-digital-patient-intake',
  templateUrl: './create-digital-patient-intake.component.html',
  styleUrls: ['./create-digital-patient-intake.component.css']
})
export class CreateDigitalPatientIntakeComponent implements OnInit {

  stepperOrientation: 'horizontal' | 'vertical' = 'horizontal';
  patientForm: FormGroup
  render: boolean = false;
  @ViewChild(MatStepper, { static: true }) public patientStepper: MatStepper;
  activeStepIndex: number = 0;
  isCompactViewport: boolean = false;

  readonly sections: Record<IntakeSectionKey, IntakeSection> = {
    welcome:  { key: 'welcome',  label: 'Welcome' },
    about:    { key: 'about',    label: 'About You' },
    health:   { key: 'health',   label: 'Your Health' },
    coverage: { key: 'coverage', label: 'Coverage' },
    confirm:  { key: 'confirm',  label: 'Confirm & Sign' }
  };

  readonly steps: IntakeStepMeta[] = [
    { key: 'consent',        label: 'Consent',     title: 'Welcome — please review your consent',          hint: 'Take your time. Tap Accept when you are ready to begin.',                  icon: 'cilShieldAlt',   section: 'welcome'  },
    { key: 'identity',       label: 'Verify',      title: 'Verify your phone number',                       hint: 'We will text you a 6-digit code to make sure it is really you.',          icon: 'cilLockLocked',  section: 'welcome'  },
    { key: 'bio',            label: 'Photo',       title: 'Add a photo of yourself',                        hint: 'Helps our staff greet you correctly when you arrive.',                    icon: 'cilUser',        section: 'welcome'  },
    { key: 'basic',          label: 'Your Info',   title: 'Tell us about yourself',                         hint: 'Name, date of birth, address and how to reach you.',                      icon: 'cilAddressBook', section: 'about'    },
    { key: 'medical',        label: 'Medical',     title: 'Your reason for visit',                          hint: 'Who referred you and how you would like us to reach you.',                icon: 'cilMedicalCross',section: 'health'   },
    { key: 'medicalhistory', label: 'History',     title: 'Your medical history',                           hint: 'Conditions, medications and past treatments. Skip what does not apply.',  icon: 'cilHistory',     section: 'health'   },
    { key: 'insurance',      label: 'Insurance',   title: 'Your insurance coverage',                        hint: 'You can use your camera in a moment to scan your card.',                  icon: 'cilCreditCard',  section: 'coverage' },
    { key: 'agreement',      label: 'Agreements',  title: 'Office agreements',                              hint: 'A few short forms required by our practice.',                             icon: 'cilTask',        section: 'confirm'  },
    { key: 'signature',      label: 'Signature',   title: 'Add your signature',                             hint: 'Sign with your finger, mouse, or have it typed for you.',                 icon: 'cilPencil',      section: 'confirm'  },
    { key: 'document',       label: 'Documents',   title: 'Upload supporting documents',                    hint: 'Photos of insurance card, ID, or referral notes — optional.',             icon: 'cilFile',        section: 'confirm'  },
    { key: 'summary',        label: 'All Done',    title: 'Review and submit',                              hint: 'Final check before you send everything to our team.',                     icon: 'cilCheck',       section: 'confirm'  }
  ];

  constructor(private breakpointObserver: BreakpointObserver,
    private digitalIntakeService: DigitalIntakeService) { }

  ngOnInit(): void {

    this.breakpointObserver.observe([
      Breakpoints.Handset,
      Breakpoints.Tablet,
    ]).subscribe(result => {
      this.isCompactViewport = result.matches;
    });
    // this.digitalIntakeService.pickupSubmissionToken().subscribe(result=>{
    //   this.render = true
    //   this.stepperOrientation = 'horizontal'

    // });
    this.createPatientForm();
  }

  get currentStep(): IntakeStepMeta {
    return this.steps[this.activeStepIndex] ?? this.steps[0];
  }

  get currentSection(): IntakeSection {
    return this.sections[this.currentStep.section];
  }

  get progressPercent(): number {
    if (this.steps.length <= 1) return 100;
    return Math.round((this.activeStepIndex / (this.steps.length - 1)) * 100);
  }

  isStepDone(index: number): boolean {
    return index < this.activeStepIndex;
  }

  isStepActive(index: number): boolean {
    return index === this.activeStepIndex;
  }

  private createPatientForm() {
    //const phoneRgx = new RegExp("^[\+]?[0-9]{0,3}\W?[(]?[0-9]{3}[)]?[-\s\.]?[(]?[0-9]{3}[)][-\s\.]?[0-9]{4,6}$");
    const phoneRgx = /^\(\d{3}\) \d{3}-\d{4}$/;
    const zipCodeRgx = new RegExp("^\\d{5}(?:[-\s]\\d{4})?$");
    this.patientForm = new FormGroup({
      'consent': new FormGroup({
        'hideCon': new FormControl(null, [Validators.required]),
      }),
      'identity': new FormGroup({
        'pPhoneNumber': new FormControl(null, [Validators.required, Validators.min(15), Validators.pattern(phoneRgx)]),
        'validOTP': new FormControl(null, [Validators.required])
      }),
      'bio': new FormGroup({
        'capturedImage': new FormControl(null, [Validators.required]),
      }),
      'basic': new FormGroup({
        'firstname': new FormControl(null, [Validators.required, noSpecialCharactersValidator(), noNumbersValidator()]),
        'middleName': new FormControl(null, [noSpecialCharactersValidator(), noNumbersValidator()]),
        'lastName': new FormControl(null, [Validators.required, noSpecialCharactersValidator(), noNumbersValidator()]),


           'firstAddress': new FormControl(null, [Validators.required, noSpecialCharactersValidator()]),
        'secondAddress': new FormControl(null, [noSpecialCharactersValidator()]),
        'city': new FormControl(null, [Validators.required, noSpecialCharactersValidator(), noNumbersValidator()]),
        'state': new FormControl(null, [Validators.required]),
        'zipCode': new FormControl(null, [Validators.required, Validators.min(10), Validators.pattern(zipCodeRgx)]),


        'dobMonth': new FormControl(''),
        'dobDay': new FormControl(''),
        'dobYear': new FormControl(''),
        'dob': new FormControl(null, [Validators.required, todayDOBValidator(), futureDateValidator(), maxDateValidator()]),
        'gender': new FormControl(null, [Validators.required]),
        'genderDescribe': new FormControl(null),
        'marital': new FormControl(null, [Validators.required]),
        'phoneType': new FormControl(null, [Validators.required]),
        'phone': new FormControl(null, [Validators.required, Validators.min(15), Validators.pattern(phoneRgx)]),
        'email': new FormControl(null, [Validators.required, EmailValidator()]),
        'employment': new FormControl(null),
        'employmentCompany': new FormControl(null),

        'guarantorFirstName': new FormControl(null, [noSpecialCharactersValidator(), noNumbersValidator()]),
        'guarantorMiddleName': new FormControl(null, [noSpecialCharactersValidator(), noNumbersValidator]),
        'guarantorLastName': new FormControl(null, [noSpecialCharactersValidator(), noNumbersValidator()]),
        'guarantorRelationship': new FormControl(null),

        'emergencyContact': new FormControl(null, [Validators.required]),
        'emergencyName': new FormControl(null, [Validators.required, noSpecialCharactersValidator()]),
        'emergencyPhone': new FormControl(null, [Validators.required, Validators.min(15), Validators.pattern(phoneRgx)]),
      }),
/*       'address': new FormGroup({
        'firstAddress': new FormControl(null, [Validators.required, noSpecialCharactersValidator()]),
        'secondAddress': new FormControl(null, [noSpecialCharactersValidator()]),
        'city': new FormControl(null, [Validators.required, noSpecialCharactersValidator(), noNumbersValidator()]),
        'state': new FormControl(null, [Validators.required]),
        'zipCode': new FormControl(null, [Validators.required, Validators.min(10), Validators.pattern(zipCodeRgx)]),
      }), */
      'medical': new FormGroup({
        'providerSearch': new FormControl(false),
        'referringSearchType': new FormControl("npi"),
        'referringSearch': new FormControl(null),
        'providerSearchName': new FormControl(null),
        'providerName': new FormControl(null),
        'providerNPI': new FormControl(null),
        'referringEntity': new FormControl(null, [Validators.required]),
        'referringEntityOther': new FormControl(null),
        'appointmentBooking': new FormControl(null, [Validators.required]),
        'isPrimaryDoctor': new FormControl(null, [Validators.required]),
        'isReceivedPhysicalTherapy': new FormControl(null, [Validators.required]),
        'PhysicalTherapyLocation': new FormControl(null),
        'PhysicalTherapyNumber': new FormControl(null),
        'communicationType': new FormControl(null, [Validators.required]),
        'communicationTime': new FormControl(null, [Validators.required]),
      }),
      'medicalhistory': new FormGroup({
        'height': new FormControl(null, [Validators.required]),
        'heightUnit': new FormControl(false),
        'weight': new FormControl(null, [Validators.required]),
        'weightUnit': new FormControl(false),
        'evaluationReason': new FormControl(null),
        'patientConditions': new FormControl(null, [Validators.required]),
        'patientConditionsSelections': new FormControl(null),
        'prescriptionMedication': new FormControl(null, [Validators.required]),
        'PhysicalTherapyLocationText': new FormControl(null),
        'isMetalImplants': new FormControl(null, [Validators.required]),
        'isXRay': new FormControl(null, [Validators.required]),
        'isXRayValue': new FormControl(null),
        'ptSpecialties': new FormControl(null, [Validators.required]),
        'isPacemaker': new FormControl(null, [Validators.required]),
        'surgeriesList': new FormControl(null, [Validators.required]),
        'surgeriesListText': new FormControl(null, [Validators.required]),
      }),
      'insurance': new FormGroup({
        'type': new FormControl(null, [Validators.required]),
        'compensation-related-injury': new FormControl(null),
        'compensation-accident-date': new FormControl(null),
        'compensation-wroker-status': new FormControl(null),
        'compensation-insurance-company': new FormControl(null),
        'compensation-claim-number': new FormControl(null),
        'compensation-adjuster-first-name': new FormControl(null),
        'compensation-adjuster-middle-name': new FormControl(null),
        'compensation-adjuster-last-name': new FormControl(null),
        'compensation-adjuster-phone': new FormControl(null),
        'compensation-attorney-first-name': new FormControl(null),
        'compensation-attorney-middle-name': new FormControl(null),
        'compensation-attorney-last-name': new FormControl(null),
        'compensation-attorney-phone': new FormControl(null),
        'compensation-case-status': new FormControl(null),

        'commercial-insurance-company': new FormControl(null),
        'commercial-insurance-company-name': new FormControl(null),
        'commercial-member-id': new FormControl(null),
        'commercial-ploicy-id': new FormControl(null),
        'commercial-ploicyHolder-relationship': new FormControl(null),
        'commercial-ploicyHolder-relationship-first-name': new FormControl(null),
        'commercial-ploicyHolder-relationship-middle-name': new FormControl(null, noSpecialCharactersValidator()),
        'commercial-ploicyHolder-relationship-last-name': new FormControl(null),
        'commercial-ploicyHolder-relationship-phone': new FormControl(null),
        'commercial-ploicyHolder-relationship-employer': new FormControl(null),
        'commercial-is-secondary-insurance': new FormControl(null),
        'commercial-secondary-insurance-insurance-company': new FormControl(null),
        'commercial-secondary-insurance-member-id': new FormControl(null),
        'commercial-secondary-insurance-ploicy-id': new FormControl(null),
        'medicaid-policy-namuber': new FormControl(null),
        'medicare-policy-namuber': new FormControl(null),
        'insurances': new FormControl(null),
      }),
      'document': new FormArray([]),
      'agreement': new FormGroup({}),
      'signature': new FormGroup({
        'generatesign': new FormControl(null),
        'drawsign': new FormControl(null)
      }),
      'summary': new FormGroup({})
    })
    this.setAddressConditionalValidators()
    this.setXRayValidator();
    this.setReferringEntityOtherValidator();
    this.setMedicalPhysicalTherapyVisitsValidator()
    this.setGenederDescribeValidator();
    PatientSourceValidator.addValidator(this.patientForm);
    PrescriptionValidator.addValidator(this.patientForm)
    XRayValidator.addValidator(this.patientForm)
    ConditionsValidator.addValidator(this.patientForm)
    AddSurgerisListValidator.addValidator(this.patientForm)
    InsuranceValidator.addValidator(this.patientForm)

    GuarantorValidator.addValidator(this.patientForm);
    PatientSourceValidator.addValidator(this.patientForm)
  }
  private setAddressConditionalValidators() {
    this.patientForm.valueChanges.subscribe((value: any) => {
      var employmentValue = value?.['basic'].employment
      if (employmentValue && employmentValue === 'Employed') {
        this.patientForm.get('basic')?.get('employmentCompany')?.setValidators(null)
      } else {
        this.patientForm.get('basic')?.get('employmentCompany')?.setValidators(null)
        this.patientForm.get('basic')?.get('employmentCompany')?.setErrors(null)
      }
    })
  }
  private setXRayValidator() {
    this.patientForm.get('medicalhistory')?.get('isXRay')?.valueChanges.subscribe((value: any) => {
      if (value) {
        this.patientForm.get('medicalhistory')?.get('isXRayValue')?.setValidators(Validators.required)
        this.patientForm.get('medicalhistory')?.get('isXRayValue')?.updateValueAndValidity();
      } else {
        this.patientForm.get('medicalhistory')?.get('isXRayValue')?.clearValidators();
        this.patientForm.get('medicalhistory')?.get('isXRayValue')?.setErrors(null);
        this.patientForm.get('medicalhistory')?.get('isXRayValue')?.updateValueAndValidity();
      }
    })
  }
  private setReferringEntityOtherValidator() {
    this.patientForm.get('medical')?.get('referringEntity')?.valueChanges.subscribe((value: any) => {
      if (value !== null && value === 'other')
        this.patientForm.get('medical')?.get('referringEntityOther')?.setValidators(Validators.required)
    })
  }
  private setMedicalPhysicalTherapyVisitsValidator() {
    this.patientForm.get('medical')?.get('isReceivedPhysicalTherapy')?.valueChanges.subscribe((value: any) => {
      if (value === 'yes') {
        this.patientForm.get('medical')?.get('PhysicalTherapyLocation')?.setValidators(Validators.required)
        this.patientForm.get('medical')?.get('PhysicalTherapyNumber')?.setValidators(Validators.required)
      }
      if (value === 'no') {
        this.patientForm.get('medical')?.get('PhysicalTherapyLocation')?.clearValidators();
        this.patientForm.get('medical')?.get('PhysicalTherapyLocation')?.setErrors(null);
        this.patientForm.get('medical')?.get('PhysicalTherapyLocation')?.updateValueAndValidity();

        this.patientForm.get('medical')?.get('PhysicalTherapyNumber')?.clearValidators();
        this.patientForm.get('medical')?.get('PhysicalTherapyNumber')?.setErrors(null);
        this.patientForm.get('medical')?.get('PhysicalTherapyNumber')?.updateValueAndValidity();
      }
    })
  }
  private setGenederDescribeValidator() {
    this.patientForm.get('basic')?.get('gender')?.valueChanges.subscribe((value: any) => {
      if (value === 'Self_Describe') {
        this.patientForm.get('basic')?.get('genderDescribe')?.setValidators(Validators.required)
      } else {
        this.patientForm.get('basic')?.get('genderDescribe')?.clearValidators();
        this.patientForm.get('basic')?.get('genderDescribe')?.setErrors(null);
        this.patientForm.get('basic')?.get('genderDescribe')?.updateValueAndValidity();
        this.patientForm.get('basic')?.get('genderDescribe')?.setValue(null)
      }
    })
  }
  onStepChange(event: StepperSelectionEvent): void {
    this.activeStepIndex = event.selectedIndex;
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
