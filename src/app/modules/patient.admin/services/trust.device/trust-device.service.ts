import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, filter, Observable, retry, switchMap, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DeviceStatus } from '../../models/trust.device/device.status';
import { TrustDevice } from '../../models/trust.device/trust.device';
import { ClinicService } from '../clinic/clinic.service';

@Injectable({
  providedIn: 'root'
})
export class TrustDeviceService {
  private trustDeviceURL = environment.baseURL + 'devices'
  constructor(private http: HttpClient, private clinicService: ClinicService) { }

  public list() {
    return this.clinicService.selectedClinic$.pipe(
      filter(clinic => clinic !== null),
      switchMap((clinicId: any) => this.clinicService.getClinicUUID(clinicId)),
      switchMap((clinicInfo: any) =>
        this.http
          .get<TrustDevice[]>(`${this.trustDeviceURL}` + '/list/clinic-id/' + clinicInfo.clinicUUID)
      ))
  }
  public revoke(deviceId: string) {
    var url = this.trustDeviceURL + "/revoke/device-id/" + deviceId
    return this.http.delete(`${url}`)
  }
}
