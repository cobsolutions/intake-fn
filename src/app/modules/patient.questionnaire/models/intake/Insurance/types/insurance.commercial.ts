import { MedicareCoverage } from "../medicare.coverage";
import { PatientRelationship } from "../patient.relationship";
import { SecondaryInsurance } from "../secondary.insurance";
import { Insurance } from "./insurance";

export interface CommercialInsurance{
    type:string;
    insuranceCompanyId?: number;
    insuranceCompanyName?: string;
    memberId?: string;
    policyId?: string;
    relationship?: string;
    secondaryInsurance?: SecondaryInsurance;
    hasSecondaryInsurance?:boolean | undefined
    medicareCoverage?: MedicareCoverage;
    hasMedicareCoverage?:boolean | undefined
    patientRelationship?: PatientRelationship;
}