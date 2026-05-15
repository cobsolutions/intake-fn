import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PatientContactSearchCriteria } from 'src/app/models/reporting/patient.contact.search.criteria';
import { PatientSearchCriteria } from 'src/app/models/reporting/patient.search.criteria';
import { PatientSurveyCriteria } from 'src/app/models/reporting/patient.survey.criteria';
import { environment } from 'src/environments/environment';
import { BasePaginationService } from '../../base.pagination/base-pagination.service';
import { IApiParams } from '../../patient-list.service';

@Injectable({
  providedIn: 'root'
})
export class PatientSourceReportingService extends BasePaginationService {

  private baseUrl = environment.baseURL + 'reports/'
  constructor(httpClient: HttpClient) { super(httpClient) }
  search(config$: BehaviorSubject<IApiParams>, searchCriteria: PatientSearchCriteria) {
    if (searchCriteria.type === 'null') {
      searchCriteria.type = null;
    }
    const url = this.baseUrl + 'search';
    return this.post(config$, url, JSON.stringify(searchCriteria))
  }
  searchAll(searchCriteria: PatientSearchCriteria) {
    const url = this.baseUrl + 'search';
    if (searchCriteria.type === 'null') {
      searchCriteria.type = null;
    }
    const headers = { 'content-type': 'application/json' }
    return this.httpClient.post(url, JSON.stringify(searchCriteria),{ 'headers': headers, observe: 'response' })
  }
  findByContact(config$: BehaviorSubject<IApiParams>,patientContactSearchCriteria: PatientContactSearchCriteria) {
    const url = this.baseUrl + 'find/contact';
    const headers = { 'content-type': 'application/json' }
    return this.post(config$,url, JSON.stringify(patientContactSearchCriteria))
  }
  findPatientSurvey(config$: BehaviorSubject<IApiParams>,patientSurveyCriteria: PatientSurveyCriteria) {
    const url = this.baseUrl + 'find/survey';
    const headers = { 'content-type': 'application/json' }
    return this.post(config$,url, JSON.stringify(patientSurveyCriteria))
  }
}
