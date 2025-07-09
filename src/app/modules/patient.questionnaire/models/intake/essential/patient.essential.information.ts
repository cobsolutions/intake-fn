import { Address } from "src/app/models/patient/address.info.model";
import { PatientEmergencyContact } from "./patient.emergency.contact";
import { PatientEmployment } from "./patient.employment";
import { PatientName } from "./patient.name";
import { PatientPhone } from "./patient.phone";
import { PatientAddress } from "./patienta.ddress";

export interface PatientEssentialInformation {
    patientName?: PatientName;
    dateOfBirth?: number;
    birthDate_date?:Date;
    birthDate_str?:string
    gender?: string;
    genderDescribe?:string
    patientPhone?: PatientPhone;
    email?: string;
    maritalStatus?: string;
    patientEmergencyContact?: PatientEmergencyContact;
    patientEmployment?: PatientEmployment;
    patientAddress? : Address
    address?:PatientAddress
  }