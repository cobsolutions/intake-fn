import { Insurance } from "./insurance";

export interface MedicareInsurance extends Insurance{
    policyId?: string;
}