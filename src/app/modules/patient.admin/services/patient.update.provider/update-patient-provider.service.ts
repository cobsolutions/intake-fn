import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { PatientProviderEditableRequest } from '../../models/patient/patient.provider.editable.request';

@Injectable({
  providedIn: 'root'
})
export class UpdatePatientProviderService {
  baseUrl: string = environment.baseURL + 'patient'
  headers = { 'content-type': 'application/json' }
  constructor(private http: HttpClient) { }

  public update(model: PatientProviderEditableRequest) {
    const url = this.baseUrl + "/update/provider"
    return this.http.put(url, JSON.stringify(model), { 'headers': this.headers, observe: 'response' })
  }
}
