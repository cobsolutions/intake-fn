
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import * as moment from 'moment';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { debounceTime, filter, finalize, map, switchMap, tap } from 'rxjs';
import { PatientRelationship } from 'src/app/models/questionnaire/Insurance/patient.relationship';
import { InsuranceType } from 'src/app/modules/common/components/insurance/insurance.type';
import { insuranceTypes } from 'src/app/modules/common/components/insurance/insurance.type.list';
import { BasicInsuranceCompany } from 'src/app/modules/patient.admin/models/basic.insurance.company';
import { Insurance } from 'src/app/modules/patient.questionnaire/models/intake/Insurance/types/insurance';
import { CommercialInsurance } from 'src/app/modules/patient.questionnaire/models/intake/Insurance/types/insurance.commercial';
import { MedicaidInsurance } from 'src/app/modules/patient.questionnaire/models/intake/Insurance/types/insurance.medicaid';
import { MedicareInsurance } from 'src/app/modules/patient.questionnaire/models/intake/Insurance/types/insurance.medicare';
import { WorkerCompensationInsurance } from 'src/app/modules/patient.questionnaire/models/intake/Insurance/types/insurance.workers.compensation';
import { SelfPay } from 'src/app/modules/patient.questionnaire/models/intake/Insurance/types/selfpay';
import { ComponentReferenceComponentService } from '../../services/component.reference/component-reference-component.service';
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
  basicInsuranceCompany: BasicInsuranceCompany[]
  secondaryInsuranceCompanies: any;
  types: InsuranceType[] = insuranceTypes;
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
  dropdownSettings: IDropdownSettings = {};
  errorMessage: string;
  constructor(private digitalIntakeService: DigitalIntakeService, private componentReference: ComponentReferenceComponentService) { }
  ngOnInit(): void {
    this.componentReference.setPatientInsuranceComponent(this)
    this.getInsuranceCompanies();
    this.form.get('insurance')?.get('type')?.valueChanges.subscribe(value => {
      if (value === undefined)
        this.isValidForm = true;
      else
        this.isValidForm = false;
      if (value === 'SelfPay') {
        this.renderedPatientInsurances = []
        this.patientInsurances = {
          commercialInsurances: [],
          workerCompensationInsurances: [],
          medicareInsurance: [],
          medicaidInsurance: [],
        }
        var selfPay: SelfPay = {
          type: 'selfpay'
        }
        this.patientInsurances.selfPay = selfPay;
        this.form.get('insurance')?.get('insurances')?.setValue(this.patientInsurances)
      } else {
        this.patientInsurances.selfPay = undefined
      }
    })
    this.form.get('insurance')?.get('type')?.valueChanges.subscribe(value => {
      this.selectedInsuranceType = value;
    })
    this.dropdownSettings = {
      singleSelection: true,
      idField: 'id',
      textField: 'name',
      itemsShowLimit: 30,
      allowSearchFilter: true
    };
  }
  add() {
    var insuranceForm: FormGroup = this.form.get('insurance') as FormGroup
    CheckInvalidForm.check(insuranceForm)
    if (this.form.get('insurance')?.valid) {
      this.isValidForm = false;
      this.addPatientIsnurance();
      this.form.get('insurance')?.get('insurances')?.setValue(this.patientInsurances)
    } else {
      this.isValidForm = true;
      ValidationExploder.explode(this.form, 'insurance')
    }
  }
  next() {
    this.validate()
  }
  private validate() {
    if (this.form.get('insurance')?.get('type')?.value === 'SelfPay')
      this.passToNextStep();
    if (this.isInsurances() && this.renderedPatientInsurances.length > 0)
      this.passToNextStep();
    if (this.selectedInsuranceType === undefined) {
      this.isValidForm = true;
      this.errorMessage = "Please select from coverage list"
    } else {
      this.isValidForm = false;
      this.errorMessage = '';
      if ((this.selectedInsuranceType !== undefined && this.selectedInsuranceType !== 'SelfPay')
        && this.renderedPatientInsurances.length === 0) {
        this.isValidForm = true;
        if (this.form.get('insurance')?.invalid) {
          ValidationExploder.explode(this.form, 'insurance')
          this.errorMessage = "Please fill in all the required fields"
        } else {
          this.errorMessage = "Please add your coverage  data to coverage list"
        }
      }
    }
  }
  private passToNextStep() {
    this.isValidForm = false;
    this.errorMessage = '';
    InsuranceValidator.clearValidator(this.form)
    this.stepper.next();
    this.isValidForm = false;
    this.form.get('insurance')?.get('type')?.setValue(null);
  }
  private isInsurances() {
    return (this.patientInsurances.commercialInsurances.length > 0 ||
      this.patientInsurances.workerCompensationInsurances.length > 0 ||
      this.patientInsurances.medicareInsurance.length > 0 ||
      this.patientInsurances.medicaidInsurance.length > 0)
  }
  private addPatientIsnurance() {
    var insuranceType: string = this.form.get('insurance')?.get('type')?.value;
    if (insuranceType === 'Commercial Insurance') {
      var patientCommercialInsurance: CommercialInsurance = this.fillPatientCommercialInsurance();
      this.patientInsurances.commercialInsurances.push(patientCommercialInsurance)
      this.renderedPatientInsurances.push(patientCommercialInsurance)
      if (patientCommercialInsurance.hasSecondaryInsurance) {
        var patientSecondaryCommercialInsurance: CommercialInsurance = {
          type: 'commercial',
          isSecondaryInsurance: true,
          _frontcontrollName: 'comm_' + this.form.get('insurance')?.get('commercial-secondary-insurance-insurance-company')?.value[0].name + '_front',
          _backcontrollName: 'comm_' + this.form.get('insurance')?.get('commercial-secondary-insurance-insurance-company')?.value[0].name + '_back',
          insuranceCompanyId: this.form.get('insurance')?.get('commercial-secondary-insurance-insurance-company')?.value[0].id,
          insuranceCompanyName: this.form.get('insurance')?.get('commercial-secondary-insurance-insurance-company')?.value[0].name,
          policyId: this.form.get('insurance')?.get('commercial-secondary-insurance-ploicy-id')?.value,
          memberId: this.form.get('insurance')?.get('commercial-secondary-insurance-member-id')?.value,
          name: this.form.get('insurance')?.get('commercial-secondary-insurance-insurance-company')?.value[0].name,
        }
        this.patientInsurances.commercialInsurances.push(patientSecondaryCommercialInsurance)
        this.renderedPatientInsurances.push(patientSecondaryCommercialInsurance)
      }
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
      _frontcontrollName: type + '_' + this.form.get('insurance')?.get('compensation-insurance-company')?.value + '_front',
      _backcontrollName: type + '_' + this.form.get('insurance')?.get('compensation-insurance-company')?.value + '_back',
    }
    return patientInsuranceCompensationNoFault;
  }
  private fillPatientCommercialInsurance() {
    var patientCommercialInsurance: CommercialInsurance = {
      type: 'commercial',
      isSecondaryInsurance: false,
      _frontcontrollName: 'comm_' + this.form.get('insurance')?.get('commercial-insurance-company')?.value[0].name + '_front',
      _backcontrollName: 'comm_' + this.form.get('insurance')?.get('commercial-insurance-company')?.value[0].name + '_back',
      memberId: this.form.get('insurance')?.get('commercial-member-id')?.value,
      policyId: this.form.get('insurance')?.get('commercial-ploicy-id')?.value,
      relationship: this.form.get('insurance')?.get('commercial-ploicyHolder-relationship')?.value,
      hasSecondaryInsurance: this.form.get('insurance')?.get('commercial-is-secondary-insurance')?.value,
      insuranceCompanyId: this.form.get('insurance')?.get('commercial-insurance-company')?.value[0].id,
      insuranceCompanyName: this.form.get('insurance')?.get('commercial-insurance-company')?.value[0].name,

      name: this.form.get('insurance')?.get('commercial-insurance-company')?.value[0].name
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
    return patientCommercialInsurance;
  }

  private fillPatientMedicareInsurance() {
    var medicareInsurance: MedicareInsurance = {
      type: 'medicare',
      policyId: this.form.get('insurance')?.get('medicare-policy-namuber')?.value,
      _frontcontrollName: 'medicare_' + this.form.get('insurance')?.get('medicare-policy-namuber')?.value + '_front',
      _backcontrollName: 'medicare_' + this.form.get('insurance')?.get('medicare-policy-namuber')?.value + '_back',
    }
    return medicareInsurance;
  }

  private fillPatientMedicaidInsurance() {
    var medicareInsurance: MedicaidInsurance = {
      type: 'medicaid',
      policyId: this.form.get('insurance')?.get('medicaid-policy-namuber')?.value,
      _frontcontrollName: 'medicaid_' + this.form.get('insurance')?.get('medicaid-policy-namuber')?.value + '_front',
      _backcontrollName: 'medicaid_' + this.form.get('insurance')?.get('medicaid-policy-namuber')?.value + '_back',
    }
    return medicareInsurance;
  }
  private getInsuranceCompanies() {
    this.digitalIntakeService.findInsuranceCompanies().pipe(
      map(result => { return result.body })
    )
      .subscribe((insuranceCompanies: any) => {
        this.basicInsuranceCompany = insuranceCompanies;
      })
  }
  remove(index: number, type: string) {
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
    this.form.get('insurance')?.get('insurances')?.setValue(this.patientInsurances)
  }
}
