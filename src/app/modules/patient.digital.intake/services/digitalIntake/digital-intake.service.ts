import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AgreementHolder } from 'src/app/models/patient/agreements/agreements.holder';
import { InsuranceCompany } from 'src/app/modules/patient.admin/models/insurance.company.model';
import { OneTimeToken } from 'src/app/modules/patient.admin/models/one.time.token/one.time.token';
import { DigitalIntakeDevice } from 'src/app/modules/patient.admin/models/trust.device/digital.intake.device';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DigitalIntakeService {
  private baseUrl = environment.baseURL + 'digital-intake'
  headers: any = {
    'requester': 'Digital_Intake_Submission',
    'content-type': 'application/json'
  }
  constructor(private http: HttpClient) { }
  create(imageFormData: FormData) {
    const createPatientURL = this.baseUrl + '/create';
    return this.http.post(createPatientURL, imageFormData)
  }
  findAgreements() {
    const findAgreementURL = this.baseUrl + '/find/agreement';
    return this.http.get<AgreementHolder[]>(findAgreementURL, { observe: 'response', withCredentials: true, 'headers': this.headers })
  }
  findInsuranceCompanybyName(name: string) {
    const findInsuranceCompanyURL = this.baseUrl + '/find/insurance/company/name/';
    return this.http.get<InsuranceCompany[]>(`${findInsuranceCompanyURL}` + name, { observe: 'response', withCredentials: true, 'headers': this.headers })
  }
  public findProviderByNPI(npi: number): Observable<any> {
    var url = this.baseUrl + '/find/provider/npi/' + npi;
    return this.http.get(url, { observe: 'response', withCredentials: true, 'headers': this.headers });
  }

  public findProviderByFirstName(name: string): Observable<any> {
    var url = this.baseUrl + '/find/provider/f-name/' + name;
    return this.http.get(url, { observe: 'response', withCredentials: true, 'headers': this.headers });
  }
  public findProviderByLastName(name: string): Observable<any> {
    var url = this.baseUrl + '/find/provider/l-name/' + name;
    return this.http.get(url, { observe: 'response', withCredentials: true, 'headers': this.headers });
  }
  public findProviderByFullName(last: string, first: string): Observable<any> {
    var url = this.baseUrl + '/find/provider/f-name/' + first + '/l-name/' + last;
    return this.http.get(url, { observe: 'response', withCredentials: true, 'headers': this.headers });
  }
  send(customerId: string, phoneNumber: string) {
    let params = new HttpParams().set('customerId', customerId).append('phoneNumber', phoneNumber);
    var url = this.baseUrl + '/opt/send';
    return this.http.post(url, undefined, { params: params, withCredentials: true, 'headers': this.headers })
  }
  validate(customerId: string, otp: string) {
    var url = this.baseUrl + '/opt/validate';
    let params = new HttpParams().set('customerId', customerId).append('otp', otp);
    return this.http.post(url, undefined, { params: params, withCredentials: true, 'headers': this.headers })
  }
  public registerDevice(digitalIntakeDevice: DigitalIntakeDevice, token: string) {
    const headers = {
      'one-time-token': token,
      'device-id': digitalIntakeDevice.deviceId,
      'requester': 'Device_Registration',
      'content-type': 'application/json'
    }
    const url = this.baseUrl + '/trust-device/register'
    return this.http.post(`${url}`, JSON.stringify(digitalIntakeDevice), { 'headers': headers, withCredentials: true, observe: 'response' })
  }
  cacheTrustDevice(token: string, deviceId: string) {

    const headers: any = {
      'one-time-token': token,
      'device-id': deviceId,
      'requester': 'Pre_Digital_Intake_Submission',
      'content-type': 'application/json'
    }
    const url = this.baseUrl + '/trust-device/cache';
    return this.http.get(`${url}`, { 'headers': headers })
  }

  cacheVerifiedMail(token:string){
    const headers: any = {
      'one-time-token': token,
      'requester': 'Pre_Digital_Intake_Mail_Submission',
      'content-type': 'application/json'
    }
    const url = this.baseUrl + '/verified-mail/cache';
    return this.http.get(`${url}`, { 'headers': headers })
  }
}
