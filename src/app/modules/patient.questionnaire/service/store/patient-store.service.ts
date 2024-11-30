import { Injectable, Optional, SkipSelf } from '@angular/core';
import { Address } from 'src/app/models/patient/address.info.model';
import { PatientEssentialInformation } from '../../models/intake/essential/patient.essential.information';
import { PatientCommercialInsurance } from '../../models/intake/Insurance/patient.commercial.insurance';
import { PatientInsurance } from '../../models/intake/Insurance/patient.insurance';
import { PatientInsuranceCompensationNoFault } from '../../models/intake/Insurance/patient.insurance.compensation.no.fault';
import { PatientMedical } from '../../models/intake/medical/patient.medical';
import { PatientMedicalHistory } from '../../models/intake/medical/patient.medical.history';
import { Patient } from '../../models/intake/patient';
import { PatientAgreement } from '../../models/intake/patient.agreement';
import { PatientGrantor } from '../../models/intake/patient.grantor';
import { PatientSignature } from '../../models/intake/patient.signature';
import { PatientSource } from '../../models/intake/source/patient.source';

@Injectable({
  providedIn: 'root'
})
export class PatientStoreService {
  patientEssentialInformation?: PatientEssentialInformation;
  patientAddress?: Address;
  patientMedical?: PatientMedical;
  patientMedicalHistory?: PatientMedicalHistory;
  patientCommercialInsurance?: PatientCommercialInsurance;
  patientInsuranceCompensationNoFault?: PatientInsuranceCompensationNoFault;
  patientInsuranceType?: string;
  patientGrantor?: PatientGrantor;
  patientSource?: PatientSource;
  patientSignature?: PatientSignature;
  patientAgreements?: PatientAgreement;
  resetPateint() {
    this.patientEssentialInformation = undefined;
    this.patientAddress = undefined;
    this.patientMedical = undefined;
    this.patientMedicalHistory = undefined;
    this.patientCommercialInsurance = undefined;
    this.patientInsuranceCompensationNoFault = undefined;
    this.patientInsuranceType = undefined;
    this.patientGrantor = undefined;
    this.patientSource = undefined;
    this.patientSignature = undefined;
    this.patientAgreements = undefined;
  }
  constructor(@Optional() @SkipSelf() sharedService?: PatientStoreService) {
    if (sharedService) {
      throw new Error('PatientStoreService is already loaded')
    }
    console.log('PatientStoreService created....!!!!');
  }

  public getPatient(): Patient {
    var patient: Patient = {};
    patient.patientEssentialInformation = this.patientEssentialInformation;
    patient.patientEssentialInformation!.patientAddress = this.patientAddress;
    patient.patientMedical = this.patientMedical;
    patient.patientMedical!.patientMedicalHistory = this.patientMedicalHistory;
    patient.patientSource = this.patientSource;
    patient.patientInsurance = {}
    if (this.patientCommercialInsurance !== undefined)
      patient.patientInsurance.patientCommercialInsurance = this.patientCommercialInsurance
    if (this.patientInsuranceCompensationNoFault !== undefined)
      patient.patientInsurance.patientInsuranceCompensationNoFault = this.patientInsuranceCompensationNoFault;
    if (this.patientGrantor)
      patient.patientGrantor = this.patientGrantor
    // patient.patientAgreements = this.patientAgreements;
    return patient;
  }
}
