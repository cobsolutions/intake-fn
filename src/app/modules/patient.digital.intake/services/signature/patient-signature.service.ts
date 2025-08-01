import { Injectable } from '@angular/core';
import { PatientSignatureComponent } from '../../components/patient.signature/patient-signature.component';


@Injectable({
  providedIn: 'root'
})
export class PatientSignatureService {
  private patientSignatureComponent: PatientSignatureComponent | null = null;
  setPatientSignatureComponent(patientSignatureComponent: PatientSignatureComponent): void {
    this.patientSignatureComponent = patientSignatureComponent;
  }

  getPatientSignatureComponent(): PatientSignatureComponent | null {
    return this.patientSignatureComponent;
  }
  constructor() { }
}
