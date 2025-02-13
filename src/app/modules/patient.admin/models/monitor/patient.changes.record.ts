import { ActionTaker } from "../one.time.token/monitor/action.taker";

export interface PatientChangesRecord{
    taker:ActionTaker,
    patientName:string,
    createdAt:number
}