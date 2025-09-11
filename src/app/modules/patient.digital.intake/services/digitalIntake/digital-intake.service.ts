import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { AgreementHolder } from 'src/app/models/patient/agreements/agreements.holder';
import { InsuranceCompany } from 'src/app/modules/patient.admin/models/insurance.company.model';
import { DigitalIntakeDevice } from 'src/app/modules/patient.admin/models/trust.device/digital.intake.device';
import { FailedIntake } from 'src/app/modules/patient.questionnaire/models/intake/failed.intake';
import { Patient } from 'src/app/modules/patient.questionnaire/models/intake/patient';
import { environment } from 'src/environments/environment';
import { PatientQuickIntakeRequest } from '../../models/quick.intake/patient.quick.intake.request';
import { PatientSurveyRequest } from '../../models/survey/patient.survey.request';

@Injectable({
  providedIn: 'root'
})
export class DigitalIntakeService {
  private baseUrl = environment.baseURL + 'digital-intake'
  headers: any = {}
  token: string;
  constructor(private http: HttpClient, private route: ActivatedRoute) {
    this.route.queryParams.subscribe((param: any) => {
      this.token = param['token'];
      this.headers = {
        'content-type': 'application/json',
        'token': param['token']
      }
    })
  }
  create(imageFormData: FormData) {
    var headers: any = {
      'token': this.token
    }
    const createPatientURL = this.baseUrl + '/create';
    return this.http.post(createPatientURL, imageFormData, { observe: 'response', withCredentials: true, 'headers': headers })
  }
  createSurvey(model: PatientSurveyRequest) {
    var headers: any = {
      'token': this.token
    }
    const createPatientURL = this.baseUrl + '/create/survey';
    return this.http.post(createPatientURL, model, { observe: 'response', withCredentials: true, 'headers': headers })
  }
  createQuickIntake(model: PatientQuickIntakeRequest) {
    var headers: any = {
      'token': this.token
    }
    const createPatientURL = this.baseUrl + '/create/quick/intake';
    return this.http.post(createPatientURL, model, { observe: 'response', withCredentials: true, 'headers': headers })
  }
  failedIntake(failedIntake: FailedIntake) {
    var headers: any = {
      'token': this.token
    }
    const createPatientURL = this.baseUrl + '/failed-intake';
    return this.http.post(createPatientURL, failedIntake, { observe: 'response', withCredentials: true, 'headers': headers })
  }
  findAgreements() {
    const findAgreementURL = this.baseUrl + '/lookups/find/agreement';
    return this.http.get<AgreementHolder[]>(findAgreementURL, { observe: 'response', withCredentials: true, 'headers': this.headers })
  }
  findInsuranceCompanybyName(name: string) {
    const findInsuranceCompanyURL = this.baseUrl + '/lookups/find/insurance/company/name/';
    return this.http.get<InsuranceCompany[]>(`${findInsuranceCompanyURL}` + name, { observe: 'response', withCredentials: true, 'headers': this.headers })
  }
  findInsuranceCompanies() {
    const findInsuranceCompanyURL = this.baseUrl + '/lookups/find/insurance/company';
    return this.http.get<InsuranceCompany[]>(`${findInsuranceCompanyURL}` + name, { observe: 'response', withCredentials: true, 'headers': this.headers })
  }
  public findProviderByNPI(npi: number): Observable<any> {
    var url = this.baseUrl + '/lookups/find/provider/npi/' + npi;
    return this.http.get(url, { observe: 'response', withCredentials: true, 'headers': this.headers });
  }

  public findProviderByFirstName(name: string): Observable<any> {
    var url = this.baseUrl + '/lookups/find/provider/f-name/' + name;
    return this.http.get(url, { observe: 'response', withCredentials: true, 'headers': this.headers });
  }
  public findProviderByLastName(name: string): Observable<any> {
    var url = this.baseUrl + '/lookups/find/provider/l-name/' + name;
    return this.http.get(url, { observe: 'response', withCredentials: true, 'headers': this.headers });
  }
  public findProviderByFullName(last: string, first: string): Observable<any> {
    var url = this.baseUrl + '/lookups/find/provider/f-name/' + first + '/l-name/' + last;
    return this.http.get(url, { observe: 'response', withCredentials: true, 'headers': this.headers });
  }
  public findsurveyById(surveyId: number): Observable<any> {
    var url = this.baseUrl + '/lookups/survey/find/' + surveyId;
    return this.http.get(url, { observe: 'response', withCredentials: true, 'headers': this.headers });
  }
  send(customerId: string, phoneNumber: string) {
    let params = new HttpParams().set('customerId', customerId).append('phoneNumber', phoneNumber);
    var url = this.baseUrl + '/send-otp/send';
    return this.http.post(url, undefined, { params: params, withCredentials: true, 'headers': this.headers })
  }
  validate(customerId: string, otp: string) {
    var url = this.baseUrl + '/send-otp/validate';
    let params = new HttpParams().set('customerId', customerId).append('otp', otp);
    return this.http.post(url, undefined, { params: params, withCredentials: true, 'headers': this.headers })
  }
  public registerDevice(digitalIntakeDevice: DigitalIntakeDevice, token: string) {
    const headers = {
      'token': token,
      'device-id': digitalIntakeDevice.deviceId,
      'content-type': 'application/json'
    }
    const url = this.baseUrl + '/trust-device/register'
    return this.http.post(`${url}`, JSON.stringify(digitalIntakeDevice), { 'headers': headers, withCredentials: true, observe: 'response' })
  }
  verifyMail(token: string, deviceId: string) {
    const headers: any = {
      'token': token,
      'device-id': deviceId,
      'content-type': 'application/json'
    }
    const url = this.baseUrl + '/patient-mail/verify-mail';
    return this.http.get(`${url}`, { 'headers': headers })
  }

  checkDevice(token: string, deviceId: string | undefined) {
    var headers: any;
    if (deviceId === undefined)
      headers = {
        'token': token,
        'content-type': 'application/json'
      }
    else
      headers = {
        'token': token,
        'device-id': deviceId,
        'content-type': 'application/json'
      }
    const url = this.baseUrl + '/trust-device/check';
    return this.http.get(`${url}`, { 'headers': headers })
  }
  validateMail(token: string) {
    var headers: any;
    headers = {
      'token': token,
      'content-type': 'application/json'
    }
    const url = this.baseUrl + '/patient-mail/validate';
    return this.http.get(`${url}`, { 'headers': headers })
  }

  pickRegistrationToken(token: string, deviceId?: string) {
    const headers: any = {
      'token': token,
      'device-id': deviceId,
      'content-type': 'application/json'
    }
    const url = this.baseUrl + '/ott/assign/registration/requester';
    return this.http.get(`${url}`, { 'headers': headers })
  }
  assignTokenToRequesterTerminal() {
    const url = this.baseUrl + '/ott/assign/submission/requester';
    return this.http.get(`${url}`, { 'headers': this.headers })
  }
  invalidateToken() {
    var headers: any = {
      'content-type': 'application/json',
      'token': this.token
    }
    const createPatientURL = this.baseUrl + '/ott/invalidate';
    return this.http.get(createPatientURL, { observe: 'response', withCredentials: true, 'headers': headers })
  }

  initDigitalIntakeRecord(requester: string) {
    var headers: any = {
      'content-type': 'application/json',
      'token': this.token
    }
    const createPatientURL = this.baseUrl + '/record/init/requester/' + requester;
    return this.http.get(createPatientURL, { observe: 'response', withCredentials: true, 'headers': headers })
  }
}
