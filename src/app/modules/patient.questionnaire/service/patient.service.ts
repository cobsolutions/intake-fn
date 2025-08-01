import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AgreementHolder } from 'src/app/models/patient/agreements/agreements.holder';
import { PatientSignature } from '../models/patient/signature.model';
import { Patient } from '../models/intake/patient';
import { KeycloakService } from 'keycloak-angular';
import { of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private baseUrl = environment.baseURL + 'patient'
  private agreementURL = environment.baseURL + 'agreement';
  constructor(private http: HttpClient, private keycloakService: KeycloakService) { }  createPatient(patient: string) {
    const createPatientURL = this.baseUrl + '/create';
    const headers = { 'content-type': 'application/json' }
    return this.http.post(createPatientURL, JSON.stringify(patient), { 'headers': headers, observe: 'response' })
  }
  otherCreatPatient(imageFormData: FormData){
    const createPatientURL = this.baseUrl + '/create-new';
    return this.http.post(createPatientURL, imageFormData)

  }
  newCreatePatient(patient: Patient) {
    const createPatientURL = this.baseUrl + '/create';
    const headers = {
      'content-type': 'application/json'
    }
    return this.http.post(createPatientURL, JSON.stringify(patient), { 'headers': headers, observe: 'response' })
  }

  upload(files: FormData, pateintId: number) {
    const uploadURL = this.baseUrl + '/upload';
    let headers = new HttpHeaders({
      'patientId': pateintId.toString(),
    });

    return this.http.post(uploadURL, files, { 'headers': headers, observe: 'response' })
  }

  getAgreement() {
    return this.http.get<AgreementHolder[]>(this.agreementURL, { observe: 'response' })
  }

  uploadPatientSignature(model: PatientSignature) {
    const headers = { 'content-type': 'application/json' }
    const uploadURL = this.baseUrl + '/signature/upload';
    return this.http.post(uploadURL, JSON.stringify(model), { 'headers': headers, observe: 'response' })
  }
  getPatientSignature(id: number) {
    const uploadURL = this.baseUrl + '/signature/patientId/' + id;
    return this.http.get<PatientSignature>(uploadURL, { observe: 'response' })
  }
}
