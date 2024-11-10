import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(private httpClient: HttpClient) { }

  public getDate(clinicId: number | null, userId: string | undefined, startDate: number | null, endDate: number | null) {
    const url = environment.baseURL + 'dashboard/data'
      + '/clinicId/' + clinicId
      + "/userId/" + userId
      + "/startDate/" + startDate
      + "/endDate/" + endDate;
    return this.httpClient.get(url)
  }

  public getGroupedPatientSource(clinicId: number[], sources: string[], months: number[]) {
    let params = new HttpParams();
    params = params.append('sources', sources.join(','));
    params = params.append('months', months.join(','));
    const url = environment.baseURL + 'dashboard' +
      '/group/patient/source/clinic/' + clinicId
    return this.httpClient.get(url,{ params: params })
  }
}
