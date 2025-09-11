import { SurveyFields } from "./survey.fields"

export interface Survey{
    id?:number
    name?:string
    surveyFields?:SurveyFields;
}