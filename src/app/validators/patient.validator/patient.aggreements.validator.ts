import * as _ from "lodash";
import { Agreements } from "src/app/models/patient/agreements/agreements.model";
import { PatientAgreement } from "src/app/modules/patient.questionnaire/models/intake/patient.agreement";
import { PropertyValidator } from "../PropertyValidator";
import { ValidatorContainer } from "../ValidatorContainer";
import { PatientValidator } from "./patient.validator";

export interface AggrementInfoRequired {
    ReleaseInformation: boolean,
    FinancialResponsibility: boolean,
    FinancialAgreement: boolean,
    Insurance: boolean
    HIPAAAcknowledgement: boolean,
    Cupping: boolean,
    Pelvic: boolean,
    PhotoVideo: boolean
}
export class PatientAggreementsValidator extends PatientValidator {
    pateintAgreements: PatientAgreement;
    requiredFields: AggrementInfoRequired = {
        ReleaseInformation: true,
        FinancialResponsibility: true,
        FinancialAgreement: true,
        Insurance: true,
        HIPAAAcknowledgement: true,
        Cupping: false,
        Pelvic: false,
        PhotoVideo: false
    }
    constructor(pateintAgreements: PatientAgreement) {
        super();
        this.pateintAgreements = pateintAgreements
    }
    protected missingFields(validatorContainer: ValidatorContainer) {
        var validators: PropertyValidator[] = new Array();
        this.validateInfo(validators);
        if (validators.length > 0) {
            validatorContainer.isValid = false;
            _.forEach(validators, validator => {
                validatorContainer.missing.push(validator)
            });
        }
    }
    protected inCorrectDate(validatorContainer: ValidatorContainer) { }

    protected validateInfo(validator: PropertyValidator[]) {
        if (!this.pateintAgreements.acceptReleaseAgreements)
            validator.push({ property: "Release of Information", message: '' });
        if (!this.pateintAgreements.acceptFinancialResponsibilityAgreements)
            validator.push({ property: "Financial Responsibility Agreement by Other than Patient’s Legal Representative", message: '' });
        if (!this.pateintAgreements.acceptFinancialAgreementAgreements)
            validator.push({ property: "Financial Agreement", message: '' });
        if (!this.pateintAgreements.acceptInsuranceAgreement)
            validator.push({ property: "Assignment of Insurance Beneﬁts", message: '' });
        if (!this.pateintAgreements.acceptHIPAAAgreements)
            validator.push({ property: "HIPAA Acknowledgement", message: '' });
    }
    isRequiredField(name: string): boolean {
        var field: boolean = false;
        Object.entries(this.requiredFields)
            .forEach(([key, value]) => {
                if (key === name) {
                    field = value;
                }
            })
        return field;
    }
}