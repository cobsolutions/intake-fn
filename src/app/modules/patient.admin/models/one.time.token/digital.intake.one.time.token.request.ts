export interface DigitalIntakeOneTimeTokenRequest{
    clinicId?:string
    expiryPeriod:number;
    requester:string;
}