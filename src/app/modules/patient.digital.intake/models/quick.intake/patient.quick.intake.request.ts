import { PatientSurveyRequest } from "../survey/patient.survey.request";

export interface PatientQuickIntakeRequest {
    firstName?: string
    middleName?: string
    lastName?: string
    phone?: string;
    email?: string
    insuranceCompany?: string,
    address?: string,
    city?: string,
    state?: string,
    zipCode?: string,
    dob?: number
    surveyStatus?: string
    patientSurveyRequest?:PatientSurveyRequest
    patientSource?:string
}
