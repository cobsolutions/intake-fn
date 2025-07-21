import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PatientSearchCriteria } from '../../models/patient.search.criteria';
import { BasePaginationService } from '../base.pagination/base-pagination.service';
import { IApiParams } from '../patient-list.service';

@Injectable({
  providedIn: 'root'
})
export class PatientSearchService extends BasePaginationService{
  private baseUrl = environment.baseURL + '/patient'
  constructor(httpClient: HttpClient) { super(httpClient) }
  
  public findFilter(config$: BehaviorSubject<IApiParams>,patientSearchCriteria:PatientSearchCriteria): Observable<any> {
    var url = this.baseUrl + '/find/filter'
    return this.post(config$, url, JSON.stringify(patientSearchCriteria))
  }

}
