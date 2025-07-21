import { ReferringProvider } from "src/app/modules/patient.questionnaire/models/intake/referring.provider/referring.provider";
import { ActionTaker } from "../one.time.token/monitor/action.taker";

export interface PatientProviderEditableRequest{
    patientId?:number,
    referringProvider?:ReferringProvider
    actionTaker?:ActionTaker
}