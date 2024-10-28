import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import * as moment from 'moment';
import { Address } from 'src/app/models/patient/address.info.model';
import { MedicareCoverage } from 'src/app/models/questionnaire/Insurance/medicare.coverage';
import { PatientRelationship } from 'src/app/models/questionnaire/Insurance/patient.relationship';
import { insuranceTypes } from 'src/app/modules/common/components/insurance/insurance.type';
import { InsuranceCompany } from 'src/app/modules/patient.admin/models/insurance.company.model';
import { InsuranceCompanyService } from 'src/app/modules/patient.admin/services/insurance.company/insurance-company.service';
import { SecondaryInsurance } from 'src/app/modules/patient.questionnaire/models/intake/Insurance/secondary.insurance';
import { Insurance } from 'src/app/modules/patient.questionnaire/models/intake/Insurance/types/insurance';
import { CommercialInsurance } from 'src/app/modules/patient.questionnaire/models/intake/Insurance/types/insurance.commercial';
import { WorkerCompensationInsurance } from 'src/app/modules/patient.questionnaire/models/intake/Insurance/types/insurance.workers.compensation';
import { CheckInvalidForm } from '../../util/invalid.form';
import { ValidationExploder } from '../create/validators/validation.exploder';

@Component({
  selector: 'patient-insurance',
  templateUrl: './patient-insurance.component.html',
  styleUrls: ['./patient-insurance.component.css']
})
export class PatientInsuranceComponent implements OnInit {
  maxDate: Date = new Date();
  @Input() stepper: MatStepper
  isValidForm: boolean = false;
  @Input() form: FormGroup;
  InsuranceCompanies: InsuranceCompany[] = new Array();
  types: string[] = insuranceTypes;
  selectedInsuranceType: string
  patientInsurances: Insurance[] = []
  constructor(private insuranceCompanyService: InsuranceCompanyService) { }
  ngOnInit(): void {
    this.insuranceCompanyService.get().subscribe((response) => {
      response.body?.forEach(element => {
        this.InsuranceCompanies?.push(element);
      });
    })
    this.form.get('insurance')?.get('type')?.valueChanges.subscribe(value => {
      this.selectedInsuranceType = value;
    })
    this.form.get('insurance')?.get('commercial-is-secondary-insurance')?.valueChanges.subscribe(value => {
      if (!value)
        this.form.get('insurance')?.get('commercial-is-medicare-coverage')?.setValue(false);
    })
  }
  add() {
    var insuranceForm: FormGroup = this.form.get('insurance') as FormGroup
    CheckInvalidForm.check(insuranceForm)
    if (this.form.get('insurance')?.valid) {
      this.isValidForm = false;
      this.addPatientIsnurance();
    } else {
      this.isValidForm = true;
      ValidationExploder.explode(this.form, 'insurance')
    }
  }
  next() {
    var insuranceForm: FormGroup = this.form.get('insurance') as FormGroup
    CheckInvalidForm.check(insuranceForm)
    if (this.form.get('insurance')?.valid) {
      this.stepper.next();
      this.isValidForm = false;
    } else {
      this.isValidForm = true;
      ValidationExploder.explode(this.form, 'insurance')
    }
  }
  private addPatientIsnurance() {
    var insuranceType: string = this.form.get('insurance')?.get('type')?.value;
    if (insuranceType === 'Commercial Insurance')
      this.patientInsurances.push(this.fillPatientCommercialInsurance())
    if (insuranceType === 'Worker\'s Compensation')
      this.patientInsurances.push(this.fillPatientInsuranceCompensationNoFault());
  }
  private fillPatientInsuranceCompensationNoFault() {
    var patientInsuranceCompensationNoFault: WorkerCompensationInsurance = {
      type: 'wroker',
      injuryType: this.form.get('insurance')?.get('compensation-related-injury')?.value,
      accidentDate_str: moment(this.form.get('insurance')?.get('compensation-accident-date')?.value).format("MM/DD/YYYY"),
      accidentDate: Number(moment(this.form.get('insurance')?.get('compensation-accident-date')?.value).format("x")),
      workerStatus: this.form.get('insurance')?.get('compensation-wroker-status')?.value,
      phone: this.form.get('insurance')?.get('compensation-phone')?.value,
      fax: this.form.get('insurance')?.get('compensation-fax')?.value,
      adjusterInfoName: this.form.get('insurance')?.get('compensation-adjuster-last-name')?.value + ',' + this.form.get('insurance')?.get('compensation-adjuster-first-name')?.value,
      adjusterInfoPhone: this.form.get('insurance')?.get('compensation-adjuster-phone')?.value,
      attorneyInfoName: this.form.get('insurance')?.get('compensation-attorney-last-name')?.value + ',' + this.form.get('insurance')?.get('compensation-attorney-first-name')?.value,
      attorneyInfoPhone: this.form.get('insurance')?.get('compensation-attorney-phone')?.value,
      caseStatus: this.form.get('insurance')?.get('compensation-case-status')?.value,
      insuranceName: this.form.get('insurance')?.get('compensation-insurance-company')?.value,
      claimNumber: this.form.get('insurance')?.get('compensation-claim-number')?.value,
    }
    var address: Address = {
      type: this.form.get('insurance')?.get('compensation-address-type')?.value,
      first: this.form.get('insurance')?.get('compensation-first-address')?.value,
      second: this.form.get('insurance')?.get('compensation-second-address')?.value,
      country: '',
      state: this.form.get('insurance')?.get('compensation-state')?.value,
      province: '',
      city: this.form.get('insurance')?.get('compensation-city')?.value,
      zipCode: this.form.get('insurance')?.get('compensation-zipcode')?.value
    }
    patientInsuranceCompensationNoFault.address = address
    return patientInsuranceCompensationNoFault;
  }
  private fillPatientCommercialInsurance() {
    var patientCommercialInsurance: CommercialInsurance = {
      type: 'commercial',
      memberId: this.form.get('insurance')?.get('commercial-member-id')?.value,
      policyId: this.form.get('insurance')?.get('commercial-ploicy-id')?.value,
      relationship: this.form.get('insurance')?.get('commercial-ploicyHolder-relationship')?.value,
      hasSecondaryInsurance: this.form.get('insurance')?.get('commercial-is-secondary-insurance')?.value,
      hasMedicareCoverage: this.form.get('insurance')?.get('commercial-is-medicare-coverage')?.value,
      insuranceCompanyId: this.form.get('insurance')?.get('commercial-insurance-company')?.value
    }
    if (patientCommercialInsurance.relationship !== 'Self') {
      var patientRelationship: PatientRelationship = {
        patientRelationshipFirstName: this.form.get('insurance')?.get('commercial-ploicyHolder-relationship-first-name')?.value,
        patientRelationshipMeddileName: this.form.get('insurance')?.get('commercial-ploicyHolder-relationship-first-commercial-ploicyHolder-relationship-middle-name')?.value,
        patientRelationshipLastName: this.form.get('insurance')?.get('commercial-ploicyHolder-relationship-last-name')?.value,
        patientRelationshipPhone: this.form.get('insurance')?.get('commercial-ploicyHolder-relationship-phone')?.value,
        employerName: this.form.get('insurance')?.get('commercial-ploicyHolder-relationship-employer')?.value,
      }
      patientCommercialInsurance.patientRelationship = patientRelationship;
    } else {
      patientCommercialInsurance.patientRelationship = undefined;
    }
    if (patientCommercialInsurance.hasSecondaryInsurance) {
      var secondaryInsurance: SecondaryInsurance = {
        policyHolderFirstName: this.form.get('insurance')?.get('commercial-is-secondary-insurance-first-name')?.value,
        policyHolderMiddleName: this.form.get('insurance')?.get('commercial-is-secondary-insurance-middle-name')?.value,
        policyHolderLastName: this.form.get('insurance')?.get('commercial-is-secondary-insurance-last-name')?.value,
        insuranceCompanyName: this.form.get('insurance')?.get('commercial-is-secondary-insurance-insurance-company')?.value,
        memberId: this.form.get('insurance')?.get('commercial-is-secondary-insurance-member-id')?.value
      }
      patientCommercialInsurance.secondaryInsurance = secondaryInsurance
    } else {
      patientCommercialInsurance.secondaryInsurance = undefined
    }
    if (patientCommercialInsurance.hasMedicareCoverage) {
      var medicareCoverage: MedicareCoverage = {
        employerFirstName: this.form.get('insurance')?.get('commercial-is-secondary-insurance-medicare-coverage-first-name')?.value,
        employerMeddileName: this.form.get('insurance')?.get('commercial-is-secondary-insurance-medicare-coverage-middle-name')?.value,
        employerLastName: this.form.get('insurance')?.get('commercial-is-secondary-insurance-medicare-coverage-last-name')?.value,
        employerPhone: this.form.get('insurance')?.get('commercial-is-secondary-insurance-medicare-coverage-phone')?.value
      }
      patientCommercialInsurance.medicareCoverage = medicareCoverage
    } else {
      patientCommercialInsurance.medicareCoverage = undefined;
    }
    return patientCommercialInsurance;
  }
}
