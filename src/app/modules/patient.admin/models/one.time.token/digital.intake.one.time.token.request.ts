export interface DigitalIntakeOneTimeTokenRequest{
    clinicId?:number
    expiryPeriod:number;
    requester:string;
}