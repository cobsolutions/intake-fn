import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Clinic } from '../../models/clinic.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private dashboard = environment.baseURL + 'dashboard'
  constructor(private http: HttpClient) { }

  public getTotalPatient(year: number, clinics: number[] | null, selectedSchedule: string) {
    const url = this.dashboard + '/clinic/'
    return this.http.get(`${url}` + clinics + '/year/' + year + '/isScheduled/' + selectedSchedule);
  }
}
