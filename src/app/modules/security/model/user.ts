import { BasicAddress } from "src/app/models/common/basic.address";
import { Clinic } from "../../patient.admin/models/clinic.model";

export interface User {
    id: string | null | undefined;
    name: string | null;
    firstName: string | null,
    lastName: string | null,
    email: string | null,
    password: string | null;
    address?: BasicAddress | null;
    userRole?: string | null;
    clinics: Clinic[] | null;
    uuid?: string
    currentRole?: string | null
    createdAt?:number
}