import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { PatientMailRequest } from '../../models/patient.channel/mail/patient.mail.request';

@Injectable({
  providedIn: 'root'
})
export class PatientIntakeMailService {
  private baseUrl = environment.baseURL + 'patient/mail';
  constructor(private httpClient: HttpClient) { }
  send(request: PatientMailRequest) {
    const url = this.baseUrl + '/send';
    const headers = { 'content-type': 'application/json' }
    return this.httpClient.put(url, JSON.stringify(request), { headers: headers })
  }
}
