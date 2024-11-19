import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { filter, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DigitalIntakeOneTimeTokenRequest } from '../../models/one.time.token/digital.intake.one.time.token.request';
import { ClinicService } from '../clinic/clinic.service';

@Injectable({
  providedIn: 'root'
})
export class OneTimeTokenService {
  private baseURL = environment.baseURL + 'one-time-token'
  constructor(private http: HttpClient, private clinicService: ClinicService) { }

  public generate(request: DigitalIntakeOneTimeTokenRequest) {
    const generateURL = this.baseURL + '/generate/jwt'
    const headers = { 'content-type': 'application/json' }
    return this.http.post(`${generateURL}`, JSON.stringify(request), { 'headers': headers, observe: 'response' })
  }
  public generatePatientMailToken(request: DigitalIntakeOneTimeTokenRequest, patientMail: string | undefined) {
    const generateURL = this.baseURL + '/generate/jwt/mail/' + patientMail
    const headers = { 'content-type': 'application/json' }
    return this.http.post(`${generateURL}`, JSON.stringify(request), { 'headers': headers, observe: 'response' })
  }
}
