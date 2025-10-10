export interface DigitalIntakeOneTimeTokenRequest{
    clinicId?:string
    expiryPeriod?:number;
    requester?:string;
    mail?:string,
    phone?:string,
    type?:string,
    surveyId?:number,
    patientId?:number
}