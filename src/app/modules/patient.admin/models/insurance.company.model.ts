import { Clinic } from "./clinic.model";

export class InsuranceCompany{
    id:number|null;
    name:string| null;
    address:string|null;
    clinics:Clinic[] | null;
    status?:boolean
    createdAt?:number
    
}
