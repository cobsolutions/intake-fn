import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PatientsCounterService {
  url:string = environment.baseURL + 'dashboard'
  public selectedYear$: BehaviorSubject<number | null> = new BehaviorSubject<number | null>(null);
  constructor(private http: HttpClient) { }

  public totalPatients(selectedYear:number){
    return this.http.get(`${this.url}` + '/monthly/' + selectedYear)
  }

  public totalPatientsDoctorSource(selectedYear:number){
    return this.http.get(`${this.url}` + '/monthly/doctor/' + selectedYear)
  }

  public totalPatientsEntitySource(selectedYear:number){
    return this.http.get(`${this.url}` + '/monthly/entity/' + selectedYear)
  }
  public getPatientsClinicsChartData(selectedYear:number){
    return this.http.get(`${this.url}` + '/clinic/' + selectedYear)
  }
}
