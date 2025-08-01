import { Patient } from "./patient";

export interface FailedIntake{
    patient?:Patient
    errorMessage?:string
}