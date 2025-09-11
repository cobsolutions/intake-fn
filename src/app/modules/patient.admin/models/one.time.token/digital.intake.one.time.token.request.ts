export interface DigitalIntakeOneTimeTokenRequest{
    clinicId?:string
    expiryPeriod?:number;
    requester:string;
    type?:string
    surveyId?:number,
    patientId?:number
}