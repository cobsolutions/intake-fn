import { Address } from "src/app/models/patient/address.info.model";
import { Insurance } from "./insurance";

export interface WorkerCompensationInsurance {
    type:string;
    injuryType?: string;
    accidentDate?: number;
    accidentDate_date?: Date;
    accidentDate_str?: string;
    insuranceName?: string;
    claimNumber?: string;
    adjusterInfoName?: string;
    adjusterInfoPhone?: string;
    attorneyInfoName?: string;
    attorneyInfoPhone?: string;
    caseStatus?: string;
}