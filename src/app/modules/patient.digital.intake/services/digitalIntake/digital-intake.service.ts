import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { AgreementHolder } from 'src/app/models/patient/agreements/agreements.holder';
import { InsuranceCompany } from 'src/app/modules/patient.admin/models/insurance.company.model';
import { PatientMailRequest } from 'src/app/modules/patient.admin/models/patient.mail/patient.mail.request';
import { DigitalIntakeDevice } from 'src/app/modules/patient.admin/models/trust.device/digital.intake.device';
import { FailedIntake } from 'src/app/modules/patient.questionnaire/models/intake/failed.intake';
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
  createSurvey(model: PatientSurveyRequest) {
    var headers: any = {
      'token': this.token
    }
    const createPatientURL = this.baseUrl + '/create/survey';
    return this.http.post(createPatientURL, model, { observe: 'response', withCredentials: true, 'headers': headers })
  }

  failedIntake(failedIntake: FailedIntake) {
    var headers: any = {
      'token': this.token
    }
    const createPatientURL = this.baseUrl + '/failed-intake';
    return this.http.post(createPatientURL, failedIntake, { observe: 'response', withCredentials: true, 'headers': headers })
  }
  findInsuranceCompanybyName(name: string) {
    const findInsuranceCompanyURL = this.baseUrl + '/lookups/find/insurance/company/name/';
    return this.http.get<InsuranceCompany[]>(`${findInsuranceCompanyURL}` + name, { observe: 'response', withCredentials: true, 'headers': this.headers })
  }

  public findsurveyById(surveyId: number): Observable<any> {
    var url = this.baseUrl + '/lookups/survey/find/' + surveyId;
    return this.http.get(url, { observe: 'response', withCredentials: true, 'headers': this.headers });
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
    return this.http.get(`${url}`)
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

  ///NEW 
  registerDeviceA(digitalIntakeDevice: DigitalIntakeDevice) {
    const url = this.baseUrl + '/register/new/device'
    return this.http.put(`${url}`, digitalIntakeDevice);
  }

  initiate() {
    const url = this.baseUrl + '/initiate'
    return this.http.put(`${url}`, null);
  }

  findAgreements() {
    const findAgreementURL = this.baseUrl + '/lookups/agreements';
    return this.http.get<AgreementHolder[]>(findAgreementURL, { observe: 'response', withCredentials: true })
  }

  findInsuranceCompanies() {
    const findInsuranceCompanyURL = this.baseUrl + '/lookups/insurances';
    return this.http.get<InsuranceCompany[]>(`${findInsuranceCompanyURL}` + name, { observe: 'response', withCredentials: true })
  }

  public findProviderByNPI(npi: number): Observable<any> {
    var url = this.baseUrl + '/provider/npi/' + npi;
    return this.http.get(url, { observe: 'response', withCredentials: true });
  }

  public findProviderByFirstName(name: string): Observable<any> {
    var url = this.baseUrl + '/provider/f-name/' + name;
    return this.http.get(url, { observe: 'response', withCredentials: true });
  }
  public findProviderByLastName(name: string): Observable<any> {
    var url = this.baseUrl + '/provider/l-name/' + name;
    return this.http.get(url, { observe: 'response', withCredentials: true });
  }
  public findProviderByFullName(last: string, first: string): Observable<any> {
    var url = this.baseUrl + '/provider/f-name/' + first + '/l-name/' + last;
    return this.http.get(url, { observe: 'response', withCredentials: true });
  }

  send(customerId: string, phoneNumber: string) {
    let params = new HttpParams().set('customerId', customerId).append('phoneNumber', phoneNumber);
    var url = this.baseUrl + '/otp/send';
    return this.http.post(url, undefined, { params: params, withCredentials: true })
  }
  validate(customerId: string, otp: string) {
    var url = this.baseUrl + '/otp/validate';
    let params = new HttpParams().set('customerId', customerId).append('otp', otp);
    return this.http.post(url, undefined, { params: params, withCredentials: true })
  }
  create(imageFormData: FormData) {
    var headers: any = {
      'token': this.token
    }
    const createPatientURL = this.baseUrl + '/create';
    return this.http.post(createPatientURL, imageFormData, { observe: 'response', withCredentials: true })
  }

  verfiyMail(patientMailRequest: PatientMailRequest) {
    const url = this.baseUrl + '/mail/verify';
    var headers: any = {
      'content-type': 'application/json'
    }
    return this.http.post(url, JSON.stringify(patientMailRequest), { observe: 'response', withCredentials: true, headers: headers })
  }

  createQuickIntake(model: PatientQuickIntakeRequest) {
    const createPatientURL = this.baseUrl + '/create/quick';
    return this.http.post(createPatientURL, model, { observe: 'response', withCredentials: true })
  }
  public findSubmissionType(): Observable<any> {
    var url = this.baseUrl + '/find/submission-type'
    return this.http.get(url, { observe: 'response', withCredentials: true });
  }
}
