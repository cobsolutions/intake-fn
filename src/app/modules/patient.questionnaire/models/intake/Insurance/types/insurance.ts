import { CommercialInsurance } from "./insurance.commercial";
import { MedicaidInsurance } from "./insurance.medicaid";
import { MedicareInsurance } from "./insurance.medicare";
import { WorkerCompensationInsurance } from "./insurance.workers.compensation";
import { SelfPay } from "./selfpay";

export interface Insurance {
    commercialInsurances: CommercialInsurance[];
    workerCompensationInsurances: WorkerCompensationInsurance[];
    medicareInsurance: MedicareInsurance[];
    medicaidInsurance: MedicaidInsurance[];
    selfPay?:SelfPay
}