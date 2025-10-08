export interface DigitalIntakeOneTimeTokenRequest{
    clinicId?:string
    expiryPeriod?:number;
    requester?:string;
    mail?:string,
    type?:string
    surveyId?:number,
    patientId?:number
}