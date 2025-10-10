import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { PatientSMSRequest } from '../../models/patient.channel/sms/patient.sms.request';

@Injectable({
  providedIn: 'root'
})
export class PatientIntakeSMSService {
  private baseUrl = environment.baseURL + 'patient/sms';
  constructor(private httpClient: HttpClient) { }
  send(request: PatientSMSRequest) {
    const url = this.baseUrl + '/send';
    const headers = { 'content-type': 'application/json' }
    return this.httpClient.put(url, JSON.stringify(request), { headers: headers })
  }
}
