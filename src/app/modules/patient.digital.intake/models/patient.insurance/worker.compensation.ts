import { Attorney } from "../attoreny"
import { PatientAddress } from "../patient.address"
import { Adjuster } from "./adjuster"

export interface WorkerCompensation {
    relatedInjury?: string,
    accidentDate?: number
    workerStatus?: string,
    patientAddress?: PatientAddress
    insuranceName?: string,
    adjuster?: Adjuster
    attorney?: Attorney
    caseStatus?: string
}