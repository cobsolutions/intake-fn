import { PatientRelationship } from "../patient.relationship";
import { SecondaryInsurance } from "../secondary.insurance";

export interface CommercialInsurance {
    type: string;
    hasSecondaryInsurance?: boolean | undefined
    isSecondaryInsurance?:boolean
    insuranceCompanyId?: number;
    insuranceCompanyName?: string;
    memberId?: string;
    policyId?: string;
    relationship?: string;
    patientRelationship?: PatientRelationship;
    secondaryInsurance?: SecondaryInsurance;
}