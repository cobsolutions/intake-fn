import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PatientSearchCriteria } from 'src/app/models/reporting/patient.search.criteria';
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
}
