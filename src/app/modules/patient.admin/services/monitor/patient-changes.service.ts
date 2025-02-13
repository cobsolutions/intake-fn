import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BasePaginationService } from '../base.pagination/base-pagination.service';
import { IApiParams } from '../patient-list.service';

@Injectable({
  providedIn: 'root'
})
export class PatientChangesService extends BasePaginationService {
  private baseUrl = environment.baseURL + '/patient/monitor'
  constructor(httpClient: HttpClient) { super(httpClient) }

  public find(config$: BehaviorSubject<IApiParams>,clinicId:number , patient:string,action:string): Observable<any> {
    var url = this.baseUrl + '/find/clinic/'+clinicId+'/patient/'+patient+'?action='+action
    return this.get(config$, url)
  }
}
