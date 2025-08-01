import * as _ from "lodash";
import { InsuranceCommercialInformation } from "src/app/models/validation/new/insurance.commercial.information";
import { InsuranceCompensationInformation } from "src/app/models/validation/new/insurance.compensation.information";
import { PatientCommercialInsurance } from "src/app/modules/patient.questionnaire/models/intake/Insurance/patient.commercial.insurance";
import { PatientInsuranceCompensationNoFault } from "src/app/modules/patient.questionnaire/models/intake/Insurance/patient.insurance.compensation.no.fault";
import { PropertyValidator } from "../PropertyValidator";
import { ValidatorContainer } from "../ValidatorContainer";
import { PatientValidator } from "./patient.validator";
export class PatientInsuranceQuestionnaireValidator extends PatientValidator {
    insurnaceCompInfoRequired?: InsuranceCompensationInformation;
    InsurnacecommerialInfoRequired?: InsuranceCommercialInformation;
    patientInsuranceCompensationNoFault?: PatientInsuranceCompensationNoFault;
    patientCommercialInsurance?: PatientCommercialInsurance;
    constructor() {
        super();
    }

    public setInsurnacecommerialInfoRequired(InsurnacecommerialInfoRequired: InsuranceCommercialInformation) {
        this.InsurnacecommerialInfoRequired = InsurnacecommerialInfoRequired;
    }
    public setInsurnaceCompInfoRequired(insurnaceCompInfoRequired: InsuranceCompensationInformation) {
        this.insurnaceCompInfoRequired = insurnaceCompInfoRequired;
    }

    public setComnsetationModel(patientInsuranceCompensationNoFault?: PatientInsuranceCompensationNoFault) {
        this.patientInsuranceCompensationNoFault = patientInsuranceCompensationNoFault;
    }
    public setCommmersialMode(patientCommercialInsurance?: PatientCommercialInsurance) {
        this.patientCommercialInsurance = patientCommercialInsurance;
    }
    protected missingFields(validatorContainer: ValidatorContainer): void {
        var validators: PropertyValidator[] = new Array();
        this.validateInfo(validators);
        if (validators.length > 0) {
            validatorContainer.isValid = false;
            _.forEach(validators, validator => {
                validatorContainer.missing.push(validator)
            });
        }
    }
    protected inCorrectDate(validatorContainer: ValidatorContainer): void {

    }
    protected validateInfo(validator: PropertyValidator[]): void {
        if (this.insurnaceCompInfoRequired === undefined && this.InsurnacecommerialInfoRequired === undefined)
            this.validateWrokerAll(validator)
        if (this.insurnaceCompInfoRequired !== undefined)
            this.validateWrokerComp(validator)
        if (this.InsurnacecommerialInfoRequired !== undefined)
            this.validateWrokerNotComp(validator)
    }
    protected isRequiredField(name: string): boolean {
        var field: boolean = false;
        if (this.InsurnacecommerialInfoRequired !== undefined) {
            Object.entries(this.InsurnacecommerialInfoRequired)
                .forEach(([key, value]) => {
                    if (key === name) {
                        field = value;
                    }
                })
        }
        if (this.insurnaceCompInfoRequired !== undefined) {
            Object.entries(this.insurnaceCompInfoRequired)
                .forEach(([key, value]) => {
                    if (key === name) {
                        field = value;
                    }
                })
        }
        return field;
    }
    private validateWrokerComp(validator: PropertyValidator[]) {
        if (this.isRequiredField('relatedInjury')) {
            if (this.patientInsuranceCompensationNoFault!.injuryType === '' || this.patientInsuranceCompensationNoFault!.injuryType === undefined)
                validator.push({ property: " Injury Type", message: '' });
        }
        if (this.isRequiredField('accidentDate')) {
            if (Number.isNaN(this.patientInsuranceCompensationNoFault!.accidentDate) || this.patientInsuranceCompensationNoFault!.accidentDate === undefined)
                validator.push({ property: " Accident Date", message: '' });
        }
        // if (this.isRequiredField('workerStatus')) {
        //     if (this.patientInsuranceCompensationNoFault!.workerStatus === '' || this.patientInsuranceCompensationNoFault!.workerStatus === undefined)
        //         validator.push({ property: " Wroker Status", message: '' });
        // }
        if (this.isRequiredField('address')) {
            if (this.patientInsuranceCompensationNoFault!.address!.first === '' || this.patientInsuranceCompensationNoFault!.address!.first === undefined)
                validator.push({ property: "First Address ", message: '' });
            if (this.patientInsuranceCompensationNoFault!.address!.second === '' || this.patientInsuranceCompensationNoFault!.address!.second === undefined)
                validator.push({ property: "Second Address", message: '' });
            if (this.patientInsuranceCompensationNoFault!.address!.type === '' || this.patientInsuranceCompensationNoFault!.address!.type === undefined)
                validator.push({ property: "Address Type", message: '' });
            if (this.patientInsuranceCompensationNoFault!.address!.country === '' || this.patientInsuranceCompensationNoFault!.address!.country === undefined)
                validator.push({ property: "Address country", message: '' });
            if (this.patientInsuranceCompensationNoFault!.address!.city === '' || this.patientInsuranceCompensationNoFault!.address!.city === undefined)
                validator.push({ property: "Address city", message: '' });
            if (this.patientInsuranceCompensationNoFault!.address!.zipCode === '' || this.patientInsuranceCompensationNoFault!.address!.zipCode === undefined)
                validator.push({ property: "Address zipCode", message: '' });
        }
        if (this.isRequiredField('fax')) {
            if (this.patientInsuranceCompensationNoFault!.fax === '' || this.patientInsuranceCompensationNoFault!.fax === undefined)
                validator.push({ property: " Fax", message: '' });
        }
        // if (this.isRequiredField('insuranceName')) {
        if (this.patientInsuranceCompensationNoFault!.insuranceName === '' || this.patientInsuranceCompensationNoFault!.insuranceName === undefined)
            validator.push({ property: " Insurance Name", message: '' });
        //}
        if (this.isRequiredField('claimNumber')) {
            if (this.patientInsuranceCompensationNoFault!.claimNumber === '' || this.patientInsuranceCompensationNoFault!.claimNumber === undefined)
                validator.push({ property: "Claim Number/ WC Case Number", message: '' });
        }
        if (this.isRequiredField('adjusterName')) {
            if (this.patientInsuranceCompensationNoFault!.adjusterInfoName === '' || this.patientInsuranceCompensationNoFault!.adjusterInfoName === undefined)
                validator.push({ property: "Adjuster Name", message: '' });
        }
        if (this.isRequiredField('adjusterPhone')) {
            if (this.patientInsuranceCompensationNoFault!.adjusterInfoPhone === '' || this.patientInsuranceCompensationNoFault!.adjusterInfoPhone === undefined)
                validator.push({ property: "Adjuster Phone", message: '' });
        }
        if (this.isRequiredField('attorneyName')) {
            if (this.patientInsuranceCompensationNoFault!.attorneyInfoName === '' || this.patientInsuranceCompensationNoFault!.attorneyInfoName === undefined)
                validator.push({ property: "Attorney Name", message: '' });
        }
        if (this.isRequiredField('attorneyPhone')) {
            if (this.patientInsuranceCompensationNoFault!.attorneyInfoPhone === '' || this.patientInsuranceCompensationNoFault!.attorneyInfoPhone === undefined)
                validator.push({ property: "Attorney Phone", message: '' });
        }
        if (this.isRequiredField('caseStatus')) {
            if (this.patientInsuranceCompensationNoFault!.caseStatus === '' || this.patientInsuranceCompensationNoFault!.caseStatus === undefined)
                validator.push({ property: "Case Status", message: '' });
        }
    }

    private validateWrokerNotComp(validator: PropertyValidator[]) {
        //if (this.isRequiredField('insuranceCompany')) {
            console.log('this.patientCommercialInsurance!.insuranceCompanyId ' + this.patientCommercialInsurance!.insuranceCompanyId)
            if (this.patientCommercialInsurance!.insuranceCompanyId === undefined || this.patientCommercialInsurance!.insuranceCompanyId === -1)
                validator.push({ property: "Insurance Company", message: '' });
        //}
        if (this.isRequiredField('memberId')) {
            if (this.patientCommercialInsurance!.memberId === '' || this.patientCommercialInsurance!.memberId === undefined)
                validator.push({ property: "Member ID", message: '' });
        }
        if (this.isRequiredField('ploicyId')) {
            if (this.patientCommercialInsurance!.policyId === '' || this.patientCommercialInsurance!.policyId === undefined)
                validator.push({ property: "Ploicy ID", message: '' });
        }
        if (this.isRequiredField('relationship')) {
            if (this.patientCommercialInsurance!.relationship === '' || this.patientCommercialInsurance!.relationship === undefined)
                validator.push({ property: "Policyholders Relationship", message: '' });
        }
        if (this.patientCommercialInsurance!.relationship !== 'Self') {
            if (this.isRequiredField('policyRelationshipFirstName-wrokernotcomp')) {
                if (this.patientCommercialInsurance!.patientRelationship?.patientRelationshipFirstName === '' || this.patientCommercialInsurance!.patientRelationship?.patientRelationshipFirstName === undefined)
                    validator.push({ property: "Policy Holder’s First Name", message: '' });
            }
            if (this.isRequiredField('policyRelationshipMiddleName-wrokernotcomp')) {
                if (this.patientCommercialInsurance!.patientRelationship?.patientRelationshipMiddleName === '' || this.patientCommercialInsurance!.patientRelationship?.patientRelationshipMiddleName === undefined)
                    validator.push({ property: "Policy Holder’s Middle Name", message: '' });
            }
            if (this.isRequiredField('policyRelationshipLastName-wrokernotcomp')) {
                if (this.patientCommercialInsurance!.patientRelationship?.patientRelationshipLastName === '' || this.patientCommercialInsurance!.patientRelationship?.patientRelationshipLastName === undefined)
                    validator.push({ property: "Policy Holder’s Last Name", message: '' });
            }
            if (this.isRequiredField('policyRelationshipPhone-wrokernotcomp')) {
                if (this.patientCommercialInsurance!.patientRelationship?.patientRelationshipPhone === '' || this.patientCommercialInsurance!.patientRelationship?.patientRelationshipPhone === undefined)
                    validator.push({ property: "Policy Holder’s Phone", message: '' });
            }
            if (this.isRequiredField('policyRelationshipEmployerName-wrokernotcomp')) {
                if (this.patientCommercialInsurance!.patientRelationship?.patientRelationshipPhone === '' || this.patientCommercialInsurance!.patientRelationship?.patientRelationshipPhone === undefined)
                    validator.push({ property: "Policy Holder’s Employer Name", message: '' });
            }
        }
        if (this.patientCommercialInsurance!.hasSecondaryInsurance === undefined)
            validator.push({ property: "Mandatory : Do you have secondry insurance?", message: '' });
        else {
            if ((this.patientCommercialInsurance!.hasSecondaryInsurance) &&
                (this.patientCommercialInsurance!.hasMedicareCoverage === undefined))
                validator.push({ property: "Mandatory : Do you have Medicare Coverage?", message: '' });
        }
    }
    public validateWrokerAll(validator: PropertyValidator[]) {
        console.log(this.insurnaceCompInfoRequired + ' ' + this.InsurnacecommerialInfoRequired)
        if (this.insurnaceCompInfoRequired === undefined && this.InsurnacecommerialInfoRequired === undefined)
            validator.push({ property: "Mandatory : Patient Insurance Type ", message: '' });
    }

}