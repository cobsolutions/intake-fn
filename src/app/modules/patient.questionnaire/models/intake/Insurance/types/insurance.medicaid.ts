import { Insurance } from "./insurance";

export interface MedicaidInsurance extends Insurance{
    policyId?: string;
}