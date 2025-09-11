import { SurveyData } from "./survey.data";

export interface PatientSurveyRequest {
    patientId: number,
    surveyName: string,
    surveyData: SurveyData[]
}