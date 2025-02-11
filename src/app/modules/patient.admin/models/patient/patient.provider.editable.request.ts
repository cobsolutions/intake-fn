import { ReferringProvider } from "src/app/modules/patient.questionnaire/models/intake/referring.provider/referring.provider";

export interface PatientProviderEditableRequest{
    patientId?:number,
    referringProvider?:ReferringProvider
}