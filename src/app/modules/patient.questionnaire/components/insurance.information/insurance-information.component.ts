import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { InsuranceQuestionnaireInfo } from 'src/app/models/questionnaire/insurance.questionnaire.info';
import { InsuranceCommercialInformation } from 'src/app/models/validation/new/insurance.commercial.information';
import { InsuranceCompensationInformation } from 'src/app/models/validation/new/insurance.compensation.information';
import { PatientInsuranceQuestionnaireValidator } from 'src/app/validators/patient.validator/patient.insurance.questionnaire.validator';
import { ValidatorContainer } from 'src/app/validators/ValidatorContainer';
import { PatientInsurance } from '../../models/intake/Insurance/patient.insurance';
import { PatientStoreService } from '../../service/store/patient-store.service';
import { WorkerCompComponent } from './worker.comp/worker-comp.component';
import { WorkerNotCompComponent } from './worker.not.comp/worker-not-comp.component';

@Component({
  selector: 'app-insurance-information',
  templateUrl: './insurance-information.component.html',
  styleUrls: ['./insurance-information.component.css']
})
export class InsuranceInformationComponent implements OnInit {
  patientInsuranceType: string | undefined = undefined;
  @ViewChild(WorkerCompComponent) workerCompComponent: WorkerCompComponent;
  @ViewChild(WorkerNotCompComponent) workerNotCompComponent: WorkerNotCompComponent;
  @Input() insurnaceCompInfoRequired?: InsuranceCompensationInformation;
  @Input() insurnacecommerialInfoRequired?: InsuranceCommercialInformation
  insuranceQuestionnaireInfo: InsuranceQuestionnaireInfo;
  patientInsurance?: PatientInsurance = {};
  constructor(private patientStoreService: PatientStoreService) { }

  ngOnInit(): void {
    if (this.patientStoreService.patientInsuranceType)
      this.patientInsuranceType = this.patientStoreService.patientInsuranceType;
  }
  workerCompNoFaultQChange(val: string) {
    if (val === 'yes') {
      this.patientStoreService.patientInsuranceType = 'CompensationNoFault'
      this.patientInsuranceType = 'CompensationNoFault'
    }
    if (val === 'no') {
      this.patientStoreService.patientInsuranceType = 'Commercial';
      this.patientInsuranceType = 'Commercial';

    }
  }
  public validate(): ValidatorContainer {
    if (this.workerCompComponent)
      return this.workerCompComponent.validate()
    if (this.workerNotCompComponent)
      return this.workerNotCompComponent.validate();
    return this.validatePatientInsurance();
  }
  public store() {
    console.log(this.patientInsuranceType)
    if (this.patientInsuranceType === 'CompensationNoFault')
      this.patientStoreService!.patientInsuranceCompensationNoFault = this.workerCompComponent.patientInsuranceCompensationNoFault;
    if (this.patientInsuranceType === 'Commercial')
      this.patientStoreService!.patientCommercialInsurance = this.workerNotCompComponent.patientCommercialInsurance;

  }
  private validatePatientInsurance(): ValidatorContainer{
    var patientValidator = new PatientInsuranceQuestionnaireValidator()
    return patientValidator.validate()
  }
}
