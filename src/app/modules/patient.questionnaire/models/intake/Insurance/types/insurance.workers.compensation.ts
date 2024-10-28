import { Address } from "src/app/models/patient/address.info.model";
import { Insurance } from "./insurance";

export interface WorkerCompensationInsurance extends Insurance{
    injuryType?: string;
    accidentDate?: number;
    accidentDate_date?: Date;
    accidentDate_str?: string;
    workerStatus?: string;
    phone?: string
    fax?: string;
    address?: Address;
    insuranceName?: string;
    claimNumber?: string;
    adjusterInfoName?: string;
    adjusterInfoPhone?: string;
    attorneyInfoName?: string;
    attorneyInfoPhone?: string;
    caseStatus?: string;
}