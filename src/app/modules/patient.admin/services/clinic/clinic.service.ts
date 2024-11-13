import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BehaviorSubject, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Clinic } from '../../models/clinic.model';
import { DeviceLocation } from '../../models/trust.device/geolocation';

@Injectable({
  providedIn: 'root'
})
export class ClinicService {
  private clinicUrl = environment.baseURL + 'clinic'
  private userUrl = environment.baseURL + 'user'
  public selectedClinic$: BehaviorSubject<number | null> = new BehaviorSubject<number | null>(null);
  public preventUser$: BehaviorSubject<boolean | null> = new BehaviorSubject<boolean | null>(null);
  public filterDate$: BehaviorSubject<number[] | null> = new BehaviorSubject<number[] | null>(null);
  constructor(private http: HttpClient) { }

  create(clinic: Clinic) {
    const headers = { 'content-type': 'application/json' }
    return this.http.post(`${this.clinicUrl}`, JSON.stringify(clinic), { 'headers': headers, observe: 'response' })
  }
  get() {
    return this.http.get<Clinic[]>(`${this.clinicUrl}` + '/find', { observe: 'response' })
  }
  getObservable():Observable<any> {
    return this.http.get<Clinic[]>(`${this.clinicUrl}` + '/find', { observe: 'response' })
  }
  checkName(name: string) {
    return this.http.get(`${this.clinicUrl}` + '/check/' + name, { observe: 'response' })
  }
  getActive(): Observable<any> {
    return this.http.get<Clinic[]>(`${this.clinicUrl}` + '/find/active', { observe: 'response' })
  }
  getByUserId(userId: string | undefined) {
    return this.http.get<Clinic[]>(`${this.userUrl}` + '/find/clinics/' + userId, { observe: 'response' })
  }
  delete(id: string | null) {
    var deleteClinicURL = this.clinicUrl + '/delete/clinicId/';
    return this.http.delete(deleteClinicURL + id)
  }
  getById(id: string | null):Observable<any> {
    return this.http.get<Clinic>(`${this.clinicUrl}` + '/find/' + id)
  }
  updateClinicLocation(id: number | null, deviceLocation: DeviceLocation) {
    const headers = { 'content-type': 'application/json' }
    const url = this.clinicUrl + '/update/location/' + id;
    return this.http.post(`${url}`, JSON.stringify(deviceLocation), { 'headers': headers, observe: 'response' })
  }

  getClinicUUID(clinicId:number){
    return this.http.get<Clinic>(`${this.clinicUrl}` + '/find-uuid/' + clinicId)
  }
}
