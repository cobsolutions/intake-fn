import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import * as moment from 'moment';
import { debounceTime, filter, finalize, switchMap, tap } from 'rxjs';
import { Address } from 'src/app/models/patient/address.info.model';
import { MedicareCoverage } from 'src/app/models/questionnaire/Insurance/medicare.coverage';
import { PatientRelationship } from 'src/app/models/questionnaire/Insurance/patient.relationship';
import { insuranceTypes } from 'src/app/modules/common/components/insurance/insurance.type';
import { SecondaryInsurance } from 'src/app/modules/patient.questionnaire/models/intake/Insurance/secondary.insurance';
import { Insurance } from 'src/app/modules/patient.questionnaire/models/intake/Insurance/types/insurance';
import { CommercialInsurance } from 'src/app/modules/patient.questionnaire/models/intake/Insurance/types/insurance.commercial';
import { MedicaidInsurance } from 'src/app/modules/patient.questionnaire/models/intake/Insurance/types/insurance.medicaid';
import { MedicareInsurance } from 'src/app/modules/patient.questionnaire/models/intake/Insurance/types/insurance.medicare';
import { WorkerCompensationInsurance } from 'src/app/modules/patient.questionnaire/models/intake/Insurance/types/insurance.workers.compensation';
import { SelfPay } from 'src/app/modules/patient.questionnaire/models/intake/Insurance/types/selfpay';
import { DigitalIntakeService } from '../../services/digitalIntake/digital-intake.service';
import { CheckInvalidForm } from '../../util/invalid.form';
import { InsuranceValidator } from '../create/validators/insurance/insurance.validator';
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
  InsuranceCompanies: any;
  secondaryInsuranceCompanies: any;
  types: string[] = insuranceTypes;
  selectedInsuranceType: string
  renderedPatientInsurances: any[] = []
  patientInsurances: Insurance = {
    commercialInsurances: [],
    workerCompensationInsurances: [],
    medicareInsurance: [],
    medicaidInsurance: [],
  }
  insuranceCompanyForm = new FormControl();
  secondaryInsuranceCompanyForm = new FormControl();
  isLoadingInsuranceCompany = false;
  isLoadingSecondaryInsuranceCompany = false;
  constructor(private digitalIntakeService: DigitalIntakeService) { }
  ngOnInit(): void {
    this.findInsuranceCompanyByNameAutoComplete();
    this.findSecondaryInsuranceCompanyByNameAutoComplete();
    this.form.get('insurance')?.get('type')?.valueChanges.subscribe(value => {
      this.selectedInsuranceType = value;
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
    // var insuranceForm: FormGroup = this.form.get('insurance') as FormGroup
    // CheckInvalidForm.check(insuranceForm)
    console.log(this.isInsurances())
    if (this.isInsurances()) {
      InsuranceValidator.clearValidator(this.form)
      this.stepper.next();
      this.isValidForm = false;
      this.form.get('insurance')?.get('insurances')?.setValue(this.patientInsurances)
    } else {
      this.isValidForm = true;
      ValidationExploder.explode(this.form, 'insurance')
    }
  }
  private isInsurances() {
    return (this.patientInsurances.commercialInsurances.length > 0 ||
      this.patientInsurances.workerCompensationInsurances.length > 0 ||
      this.patientInsurances.medicareInsurance.length > 0 ||
      this.patientInsurances.medicaidInsurance.length > 0 ||
      this.patientInsurances.selfPay !== undefined)
  }
  private addPatientIsnurance() {
    var insuranceType: string = this.form.get('insurance')?.get('type')?.value;
    if (insuranceType === 'Commercial Insurance') {
      var patientCommercialInsurance: CommercialInsurance = this.fillPatientCommercialInsurance();
      this.patientInsurances.commercialInsurances.push(patientCommercialInsurance)
      this.renderedPatientInsurances.push(patientCommercialInsurance)
    }
    if (insuranceType === 'Worker\'s Compensation') {
      var patientInsuranceCompensationNoFault: WorkerCompensationInsurance = this.fillPatientInsuranceCompensationNoFault('worker');
      this.patientInsurances.workerCompensationInsurances.push(patientInsuranceCompensationNoFault);
      this.renderedPatientInsurances.push(patientInsuranceCompensationNoFault)
    }
    if (insuranceType === 'Medicare') {
      var medicareInsurance: MedicareInsurance = this.fillPatientMedicareInsurance()
      this.patientInsurances.medicareInsurance.push(medicareInsurance);
      this.renderedPatientInsurances.push(medicareInsurance)
    }
    if (insuranceType === 'Medicaid') {
      var medicaidInsurance: MedicaidInsurance = this.fillPatientMedicaidInsurance();
      this.patientInsurances.medicaidInsurance.push(medicaidInsurance);
      this.renderedPatientInsurances.push(medicaidInsurance)
    }
    if (insuranceType === 'Auto Accident') {
      var patientInsuranceCompensationNoFault: WorkerCompensationInsurance = this.fillPatientInsuranceCompensationNoFault('auto_acc');
      patientInsuranceCompensationNoFault.accidentDate_str = moment(this.form.get('insurance')?.get('compensation-accident-date')?.value).format("MM/DD/YYYY");
      patientInsuranceCompensationNoFault.accidentDate = Number(moment(this.form.get('insurance')?.get('compensation-accident-date')?.value).format("x"));
      this.patientInsurances.workerCompensationInsurances.push(patientInsuranceCompensationNoFault);
      this.renderedPatientInsurances.push(patientInsuranceCompensationNoFault)
    }
    if (insuranceType === 'SelfPay') {
      var selfPay: SelfPay = {
        type: 'selfpay'
      }
      this.patientInsurances.selfPay = selfPay;
      this.renderedPatientInsurances.push(selfPay)
    }
    this.form.get('insurance')?.reset();

  }
  private fillPatientInsuranceCompensationNoFault(type: string) {
    var patientInsuranceCompensationNoFault: WorkerCompensationInsurance = {
      type: type,
      accidentDate_str: moment(this.form.get('insurance')?.get('compensation-accident-date')?.value).format("MM/DD/YYYY"),
      accidentDate: Number(moment(this.form.get('insurance')?.get('compensation-accident-date')?.value).format("x")),
      adjusterInfoName: this.form.get('insurance')?.get('compensation-adjuster-last-name')?.value + ',' + this.form.get('insurance')?.get('compensation-adjuster-first-name')?.value,
      adjusterInfoPhone: this.form.get('insurance')?.get('compensation-adjuster-phone')?.value,
      attorneyInfoName: this.form.get('insurance')?.get('compensation-attorney-last-name')?.value + ',' + this.form.get('insurance')?.get('compensation-attorney-first-name')?.value,
      attorneyInfoPhone: this.form.get('insurance')?.get('compensation-attorney-phone')?.value,
      caseStatus: this.form.get('insurance')?.get('compensation-case-status')?.value,
      insuranceName: this.form.get('insurance')?.get('compensation-insurance-company')?.value,
      claimNumber: this.form.get('insurance')?.get('compensation-claim-number')?.value,
    }
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
      insuranceCompanyId: this.form.get('insurance')?.get('commercial-insurance-company')?.value,
      insuranceCompanyName: this.insuranceCompanyForm?.value
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
        insuranceCompanyName: this.form.get('insurance')?.get('commercial-secondary-insurance-insurance-company')?.value,
        policyId: this.form.get('insurance')?.get('commercial-secondary-insurance-ploicy-id')?.value,
        memberId: this.form.get('insurance')?.get('commercial-secondary-insurance-member-id')?.value,
      }
      patientCommercialInsurance.secondaryInsurance = secondaryInsurance
    } else {
      patientCommercialInsurance.secondaryInsurance = undefined
    }
    return patientCommercialInsurance;
  }

  private fillPatientMedicareInsurance() {
    var medicareInsurance: MedicareInsurance = {
      type: 'medicare',
      policyId: this.form.get('insurance')?.get('medicare-policy-namuber')?.value,
    }
    return medicareInsurance;
  }

  private fillPatientMedicaidInsurance() {
    var medicareInsurance: MedicaidInsurance = {
      type: 'medicaid',
      policyId: this.form.get('insurance')?.get('medicaid-policy-namuber')?.value,
    }
    return medicareInsurance;
  }
  private findInsuranceCompanyByNameAutoComplete() {
    this.insuranceCompanyForm.valueChanges
      .pipe(
        filter(text => {
          if (text === undefined)
            return false;
          if (text.length > 0) {
            return true
          } else {
            this.InsuranceCompanies = [];
            return false;
          }
        }),
        debounceTime(500),
        tap((value) => {
          this.InsuranceCompanies = [];
          this.isLoadingInsuranceCompany = true;
        }),
        switchMap((value) => {
          return this.digitalIntakeService.findInsuranceCompanybyName(value)
            .pipe(
              finalize(() => {
                this.isLoadingInsuranceCompany = false
              }),
            )
        }
        )
      )
      .subscribe(data => {
        if (data == undefined) {
          this.InsuranceCompanies = [];
        } else {
          console.log(JSON.stringify(data))
          this.InsuranceCompanies = data.body;
        }
      },
        error => {
          this.isLoadingInsuranceCompany = false
        });
  }
  private findSecondaryInsuranceCompanyByNameAutoComplete() {
    this.secondaryInsuranceCompanyForm.valueChanges
      .pipe(
        filter(text => {
          if (text === undefined)
            return false;
          if (text.length > 0) {
            return true
          } else {
            this.secondaryInsuranceCompanies = [];
            return false;
          }
        }),
        debounceTime(500),
        tap((value) => {
          this.secondaryInsuranceCompanies = [];
          this.isLoadingSecondaryInsuranceCompany = true;
        }),
        switchMap((value) => {
          return this.digitalIntakeService.findInsuranceCompanybyName(value)
            .pipe(
              finalize(() => {
                this.isLoadingSecondaryInsuranceCompany = false
              }),
            )
        }
        )
      )
      .subscribe(data => {
        if (data == undefined) {
          this.secondaryInsuranceCompanies = [];
        } else {
          this.secondaryInsuranceCompanies = data.body;
        }
      },
        error => {
          this.isLoadingSecondaryInsuranceCompany = false
        });
  }
  remove(index: number, type: string) {
    console.log('remove')
    const obj = this.renderedPatientInsurances[index];
    console.log(type)
    //commercial
    if (type === 'commercial') {
      const _objIndex = this.patientInsurances.commercialInsurances.indexOf(obj);
      if (index !== -1) {
        this.patientInsurances.commercialInsurances.splice(_objIndex, 1);
      }
    }
    //worker
    if (type === 'worker') {
      const _objIndex = this.patientInsurances.workerCompensationInsurances.indexOf(obj);
      if (index !== -1) {
        this.patientInsurances.commercialInsurances.splice(_objIndex, 1);
      }
    }
    //auto_acc
    if (type === 'auto_acc') {
      const _objIndex = this.patientInsurances.workerCompensationInsurances.indexOf(obj);
      if (index !== -1) {
        this.patientInsurances.workerCompensationInsurances.splice(_objIndex, 1);
      }
    }

    if (type === 'medicare') {
      const _objIndex = this.patientInsurances.medicareInsurance.indexOf(obj);
      if (index !== -1) {
        this.patientInsurances.medicareInsurance.splice(_objIndex, 1);
      }
    }
    if (type === 'medicaid') {
      const _objIndex = this.patientInsurances.medicaidInsurance.indexOf(obj);
      if (index !== -1) {
        this.patientInsurances.medicaidInsurance.splice(_objIndex, 1);
      }
    }
    //selfpay
    if (type === 'selfpay') {
      this.patientInsurances.selfPay = undefined
    }
    this.renderedPatientInsurances.splice(index, 1);
  }
}
