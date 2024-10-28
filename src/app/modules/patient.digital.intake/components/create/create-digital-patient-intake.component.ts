import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { TrustDeviceService } from 'src/app/modules/patient.admin/services/trust.device/trust-device.service';
import { CacheClinicService } from '../../services/cache.clinic/cache-clinic.service';
import { imageDocumentValidator } from './validators/custom.validation/document.image.validator';
import { EmailValidator } from './validators/custom.validation/email.validator';
import { futureDateValidator } from './validators/custom.validation/future.date.validator';
import { maxDateValidator } from './validators/custom.validation/max.date.validator';
import { noSpecialCharactersValidator } from './validators/custom.validation/special.characters.validator';
import { todayDOBValidator } from './validators/custom.validation/today.dob.validator';
import { DocumentValidator } from './validators/document/document.validator';
import { GuarantorValidator } from './validators/guarantor/guarantor.validator';
import { InsuranceValidator } from './validators/insurance/insurance.validator';
import { PrescriptionValidator } from './validators/medical.history/add.prescription.validator';
import { AddSurgerisListValidator } from './validators/medical.history/add.surgeries.list';
import { ConditionsValidator } from './validators/medical.history/conditions.validator';
import { PatientSourceValidator } from './validators/patient.source/patient.source.validator';
import { PhysicalTherapyValidator } from './validators/physical.therapy/add.physical.therapy.validator';

@Component({
  selector: 'app-create-digital-patient-intake',
  templateUrl: './create-digital-patient-intake.component.html',
  styleUrls: ['./create-digital-patient-intake.component.css']
})
export class CreateDigitalPatientIntakeComponent implements OnInit {
  stepperOrientation: 'horizontal' | 'vertical' = 'horizontal';
  patientForm: FormGroup
  @ViewChild(MatStepper, { static: true }) public patientStepper: MatStepper;
  constructor(private breakpointObserver: BreakpointObserver,
    private cacheClinicService: CacheClinicService,
    private trustDeviceService: TrustDeviceService,
    private cookieService: CookieService,
    private router: Router) { }

  ngOnInit(): void {
    this.checkDeviceStatus()
    this.breakpointObserver.observe([
      Breakpoints.HandsetPortrait,
      Breakpoints.HandsetLandscape
    ]).subscribe(result => {
      this.stepperOrientation = result.matches ? 'vertical' : 'horizontal';
    });

    this.createPatientForm();
  }
  private createPatientForm() {
    const phoneRgx = new RegExp("^[\+]?[0-9]{0,3}\W?[(]?[0-9]{3}[)]?[-\s\.]?[(]?[0-9]{3}[)][-\s\.]?[0-9]{4,6}$");
    const zipCodeRgx = new RegExp("^\\d{5}(?:[-\s]\\d{4})?$");
    this.patientForm = new FormGroup({
      'basic': new FormGroup({
        'firstname': new FormControl(null, [Validators.required, noSpecialCharactersValidator()]),
        'middleName': new FormControl(null, noSpecialCharactersValidator()),
        'lastName': new FormControl(null, [Validators.required, noSpecialCharactersValidator()]),
        'dob': new FormControl(null, [Validators.required, todayDOBValidator(), futureDateValidator(), maxDateValidator()]),
        'gender': new FormControl(null, [Validators.required]),
        'marital': new FormControl(null, [Validators.required]),
        'phoneType': new FormControl(null, [Validators.required]),
        'phone': new FormControl(null, [Validators.required, Validators.min(15), Validators.pattern(phoneRgx)]),
        'email': new FormControl(null, [Validators.required, EmailValidator()]),
        'employment': new FormControl(null),
        'employmentCompany': new FormControl(null),

        'guarantorFirstName': new FormControl(null),
        'guarantorMiddleName': new FormControl(null, noSpecialCharactersValidator()),
        'guarantorLastName': new FormControl(null),
        'guarantorRelationship': new FormControl(null),

        'emergencyContact': new FormControl(null, [Validators.required]),
        'emergencyName': new FormControl(null, [Validators.required, noSpecialCharactersValidator()]),
        'emergencyPhone': new FormControl(null, [Validators.required, Validators.min(15), Validators.pattern(phoneRgx)]),
      }),
      'address': new FormGroup({
        'firstAddress': new FormControl(null, [Validators.required, noSpecialCharactersValidator()]),
        'secondAddress': new FormControl(null, [noSpecialCharactersValidator()]),
        'city': new FormControl(null, [Validators.required, noSpecialCharactersValidator()]),
        'state': new FormControl(null, [Validators.required]),
        'zipCode': new FormControl(null, [Validators.required, Validators.min(10), Validators.pattern(zipCodeRgx)]),
      }),
      'medical': new FormGroup({
        'isReferring': new FormControl(null, [Validators.required]),
        'providerSearch': new FormControl(false),
        'referringSearchType': new FormControl("l-name"),
        'referringSearch': new FormControl(null),
        'providerSearchName': new FormControl(null),
        'providerName': new FormControl(null),
        'providerNPI': new FormControl(null),
        'referringEntity': new FormControl(null),
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
        'compensation-address-type': new FormControl(null),
        'compensation-first-address': new FormControl(null),
        'compensation-second-address': new FormControl(null),
        'compensation-state': new FormControl(null),
        'compensation-city': new FormControl(null),
        'compensation-zipcode': new FormControl(null),
        'compensation-phone': new FormControl(null),
        'compensation-fax': new FormControl(null),
        'compensation-adjuster-first-name': new FormControl(null),
        'compensation-adjuster-middle-name': new FormControl(null, noSpecialCharactersValidator()),
        'compensation-adjuster-last-name': new FormControl(null),
        'compensation-adjuster-phone': new FormControl(null),
        'compensation-attorney-first-name': new FormControl(null,),
        'compensation-attorney-middle-name': new FormControl(null, noSpecialCharactersValidator()),
        'compensation-attorney-last-name': new FormControl(null),
        'compensation-attorney-phone': new FormControl(null),
        'compensation-case-status': new FormControl(null),

        'commercial-insurance-company': new FormControl(null),
        'commercial-member-id': new FormControl(null),
        'commercial-ploicy-id': new FormControl(null),
        'commercial-ploicyHolder-relationship': new FormControl(null),
        'commercial-ploicyHolder-relationship-first-name': new FormControl(null),
        'commercial-ploicyHolder-relationship-middle-name': new FormControl(null, noSpecialCharactersValidator()),
        'commercial-ploicyHolder-relationship-last-name': new FormControl(null),
        'commercial-ploicyHolder-relationship-phone': new FormControl(null),
        'commercial-ploicyHolder-relationship-employer': new FormControl(null),
        'commercial-is-secondary-insurance': new FormControl(false),
        'commercial-is-medicare-coverage': new FormControl(false),
        'commercial-is-secondary-insurance-insurance-company': new FormControl(null),
        'commercial-is-secondary-insurance-member-id': new FormControl(null),
        'commercial-is-secondary-insurance-first-name': new FormControl(null),
        'commercial-is-secondary-insurance-middle-name': new FormControl(null, noSpecialCharactersValidator()),
        'commercial-is-secondary-insurance-last-name': new FormControl(null),
        'commercial-is-secondary-insurance-medicare-coverage-first-name': new FormControl(null),
        'commercial-is-secondary-insurance-medicare-coverage-middle-name': new FormControl(null, noSpecialCharactersValidator()),
        'commercial-is-secondary-insurance-medicare-coverage-last-name': new FormControl(null),
        'commercial-is-secondary-insurance-medicare-coverage-phone': new FormControl(null),
        'medicare-policy-namuber': new FormControl(null),
        'medicaid-policy-namuber': new FormControl(null),
        'insurances': new FormControl(null),
        'isSelfPay': new FormControl(null),
      }),
      'document': new FormGroup({
        'id-front': new FormControl(null, [imageDocumentValidator()]),
        'id-back': new FormControl(null, [imageDocumentValidator()]),
        'insurance-fornt': new FormControl(null, [imageDocumentValidator()]),
        'insurance-back': new FormControl(null, [imageDocumentValidator()]),
        'guarantorIdFront': new FormControl(null, imageDocumentValidator()),
        'guarantorIdBack': new FormControl(null, imageDocumentValidator()),
      }),
      'agreement': new FormGroup({
        'release-Information': new FormControl(null, [Validators.requiredTrue]),
        'financial-responsibility': new FormControl(null, [Validators.requiredTrue]),
        'financial-agreement': new FormControl(null, [Validators.requiredTrue]),
        'Insurance-agreement': new FormControl(null, [Validators.requiredTrue]),
        'hipaa-acknowledgement': new FormControl(null, [Validators.requiredTrue]),
        'cancellation-policy': new FormControl(null, [Validators.requiredTrue]),
        'communication-attestation': new FormControl(null, [Validators.requiredTrue]),
        'authorization': new FormControl(null, [Validators.requiredTrue]),
        'consent-treatment': new FormControl(null, [Validators.requiredTrue]),
        'notice-of-privacy-practices': new FormControl(null, [Validators.requiredTrue]),
        'insurance-eligibility': new FormControl(null, [Validators.requiredTrue]),
        'assignment-release-of-benefits': new FormControl(null, [Validators.requiredTrue]),
        'cupping-agreement': new FormControl(null),
        'pelvic-agreement': new FormControl(null),
        'photo-video-agreement': new FormControl(null),
      }),
      'signature': new FormGroup({
        'generatesign': new FormControl(null),
        'drawsign': new FormControl(null)
      }),
      'summary': new FormGroup({

      })
    })
    this.setAddressConditionalValidators()
    this.setXRayValidator();
    this.setReferringEntityOtherValidator();
    PatientSourceValidator.addValidator(this.patientForm);
    PrescriptionValidator.addValidator(this.patientForm)
    ConditionsValidator.addValidator(this.patientForm)
    AddSurgerisListValidator.addValidator(this.patientForm)
    InsuranceValidator.addValidator(this.patientForm)
    DocumentValidator.addValidator(this.patientForm)
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

  private checkDeviceStatus() {
    if (this.cookieService.check('device-id')) {
      const deviceId: string = this.cookieService.get('device-id');
      const clinicId: number = this.cacheClinicService.getClinic();
      this.trustDeviceService.checkDeviceStatus(clinicId, deviceId).subscribe(reus => {
        console.log(JSON.stringify(reus))
      }, error => {
        console.log(error)
        const errorCode = { code: 2 };
        this.router.navigate(['/digital-intake/corrupted'], { state: { errorCode } });
      })
    } else {
      const errorCode = { code: 1 };
      this.router.navigate(['/digital-intake/corrupted'], { state: { errorCode } });
    }
  }
}
