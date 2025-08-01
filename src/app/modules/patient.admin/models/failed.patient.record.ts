import { Patient } from "../../patient.questionnaire/models/intake/patient";

export interface FailedPatientRecord{
    patient?:Patient,
    errorMessage?:string,
    patientIntakeUUID?:string
}