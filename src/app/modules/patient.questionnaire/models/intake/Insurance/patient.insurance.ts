import { PatientCommercialInsurance } from "./patient.commercial.insurance";
import { PatientInsuranceCompensationNoFault } from "./patient.insurance.compensation.no.fault";

export interface PatientInsurance {
    patientCommercialInsurance?: PatientCommercialInsurance;
    patientInsuranceCompensationNoFault?: PatientInsuranceCompensationNoFault;
  }