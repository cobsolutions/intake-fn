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
  activeStepIndex: number;
  constructor(private breakpointObserver: BreakpointObserver,
    private digitalIntakeService: DigitalIntakeService) { }

  ngOnInit(): void {

    this.breakpointObserver.observe([
      Breakpoints.Handset,
      Breakpoints.Tablet,
    ]).subscribe(result => {
      result.matches ? this.stepperOrientation = 'vertical' : this.stepperOrientation = 'horizontal'

    });
    // this.digitalIntakeService.pickupSubmissionToken().subscribe(result=>{
    //   this.render = true
    //   this.stepperOrientation = 'horizontal'

    // });
    this.createPatientForm();
  }
  private createPatientForm() {
    const phoneRgx = new RegExp("^[\+]?[0-9]{0,3}\W?[(]?[0-9]{3}[)]?[-\s\.]?[(]?[0-9]{3}[)][-\s\.]?[0-9]{4,6}$");
    const zipCodeRgx = new RegExp("^\\d{5}(?:[-\s]\\d{4})?$");
    this.patientForm = new FormGroup({
      'consent': new FormGroup({
        'hideCon': new FormControl(null, [Validators.required]),
      }),
      'identity': new FormGroup({
        'pPhoneNumber': new FormControl(null, [Validators.required, Validators.min(15), Validators.pattern(phoneRgx)]),
      }),
      'bio': new FormGroup({
        'capturedImage': new FormControl(null, [Validators.required]),
      }),
      'basic': new FormGroup({
        'firstname': new FormControl(null, [Validators.required, noSpecialCharactersValidator(), noNumbersValidator()]),
        'middleName': new FormControl(null, [noSpecialCharactersValidator(), noNumbersValidator()]),
        'lastName': new FormControl(null, [Validators.required, noSpecialCharactersValidator(), noNumbersValidator()]),
        'dob': new FormControl(null, [Validators.required, todayDOBValidator(), futureDateValidator(), maxDateValidator()]),
        'gender': new FormControl(null, [Validators.required]),
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
      'address': new FormGroup({
        'firstAddress': new FormControl(null, [Validators.required, noSpecialCharactersValidator()]),
        'secondAddress': new FormControl(null, [noSpecialCharactersValidator()]),
        'city': new FormControl(null, [Validators.required, noSpecialCharactersValidator(),noNumbersValidator()]),
        'state': new FormControl(null, [Validators.required]),
        'zipCode': new FormControl(null, [Validators.required, Validators.min(10), Validators.pattern(zipCodeRgx)]),
      }),
      'medical': new FormGroup({
        'providerSearch': new FormControl(false),
        'referringSearchType': new FormControl("l-name"),
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
        'isSelfPay': new FormControl(null),
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
  onStepChange(event: StepperSelectionEvent): void {
    this.activeStepIndex = event.selectedIndex;
  }
}
