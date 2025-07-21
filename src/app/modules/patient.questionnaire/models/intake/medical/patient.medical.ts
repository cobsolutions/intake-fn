import { PatientMedicalHistory } from "./patient.medical.history";
import { PatientPhysicalTherapy } from "./patient.physical.therapy";

export interface PatientMedical {
    // familyResultSubmission?: boolean;
    appointmentBooking?: string;
    primaryDoctor?: string;
    communicationType?:string,
    communicationTime?:string
    patientMedicalHistory?: PatientMedicalHistory;
    patientPhysicalTherapy?: PatientPhysicalTherapy;
    hasPatientPhysicalTherapy?:boolean | undefined;
  }