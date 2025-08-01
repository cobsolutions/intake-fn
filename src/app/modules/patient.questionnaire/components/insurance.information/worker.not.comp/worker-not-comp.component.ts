import { Component, Input, OnInit } from '@angular/core';
import { WrokerNotComp } from 'src/app/models/questionnaire/Insurance/worker.not.comp';
import { InsuranceCommercialInformation } from 'src/app/models/validation/new/insurance.commercial.information';
import { InsuranceCompany } from 'src/app/modules/patient.admin/models/insurance.company.model';
import { InsuranceCompanyService } from 'src/app/modules/patient.admin/services/insurance.company/insurance-company.service';
import { PatientInsuranceQuestionnaireValidator } from 'src/app/validators/patient.validator/patient.insurance.questionnaire.validator';
import { ValidatorContainer } from 'src/app/validators/ValidatorContainer';
import { PatientCommercialInsurance } from '../../../models/intake/Insurance/patient.commercial.insurance';
import { PatientStoreService } from '../../../service/store/patient-store.service';

@Component({
  selector: 'app-worker-not-comp',
  templateUrl: './worker-not-comp.component.html',
  styleUrls: ['./worker-not-comp.component.css']
})
export class WorkerNotCompComponent implements OnInit {
  InsuranceCompanies: InsuranceCompany[] = new Array();
  model: WrokerNotComp
  patientCommercialInsurance?: PatientCommercialInsurance;
  isSecondaryInsurance: boolean | undefined = undefined;
  isMedicareCoverage: boolean | undefined = undefined;
  @Input() insurnacecommerialInfoRequired?: InsuranceCommercialInformation
  constructor(private patientStoreService: PatientStoreService, private insuranceCompanyService: InsuranceCompanyService) { }

  ngOnInit(): void {
    this.insuranceCompanyService.get().subscribe((response) => {
      response.body?.forEach(element => {
        this.InsuranceCompanies?.push(element);
      });
    })
    if (this.patientStoreService.patientCommercialInsurance === undefined) {
      this.patientCommercialInsurance = {
        relationship: '',
        insuranceCompanyId: -1
      }
    } else {
      this.patientCommercialInsurance = this.patientStoreService.patientCommercialInsurance;
      this.isSecondaryInsurance = this.patientCommercialInsurance.secondaryInsurance ? true : false
      this.isMedicareCoverage = this.patientCommercialInsurance.medicareCoverage? true : false
    }
  }
  isSecondaryInsuranceChange(val: string) {
    this.patientCommercialInsurance!.secondaryInsurance = val === 'yes' ? {} : undefined
    this.patientCommercialInsurance!.hasSecondaryInsurance = val === 'yes' ? true : false
  }
  isMedicareCoverageChange(val: string) {
    this.patientCommercialInsurance!.medicareCoverage = val === 'yes' ? {} : undefined
    this.patientCommercialInsurance!.hasMedicareCoverage = val === 'yes' ? true : false
  }
  isPatientRelationshipDTOChange() {
    if (this.patientCommercialInsurance!.relationship !== 'Self') {
      this.patientCommercialInsurance!.patientRelationship = {}
    } else {
      this.patientCommercialInsurance!.patientRelationship = undefined
    }
  }
  isRequiredField(name: string): boolean {
    var field: boolean = false;
    Object.entries(this.insurnacecommerialInfoRequired!)
      .forEach(([key, value]) => {
        if (key === name) {
          field = value;
        }
      })
    return field;
  }

  public validate(): ValidatorContainer {
    var patientValidator = new PatientInsuranceQuestionnaireValidator();
    patientValidator.setInsurnacecommerialInfoRequired(this.insurnacecommerialInfoRequired!)
    patientValidator.setCommmersialMode(this.patientCommercialInsurance)
    return patientValidator.validate();
  }
}
