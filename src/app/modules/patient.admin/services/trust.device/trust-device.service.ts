import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, filter, Observable, retry, switchMap, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DeviceInformation } from '../../models/trust.device/device.information';
import { DeviceStatus } from '../../models/trust.device/device.status';
import { DeviceTokenRequest } from '../../models/trust.device/device.token.request';
import { TrustDevice } from '../../models/trust.device/trust.device';
import { ClinicService } from '../clinic/clinic.service';

@Injectable({
  providedIn: 'root'
})
export class TrustDeviceService {
  private trustDeviceURL = environment.baseURL + 'trusted-device'
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
  public registerDevice(deviceTokenRequest: DeviceTokenRequest) {
    const headers = {
      'one-time-token':  deviceTokenRequest.token,
      'clinic-id': deviceTokenRequest.clinicId,
      'device-id': deviceTokenRequest.deviceInformation.deviceId,
      'content-type': 'application/json'
    }
    return this.http.post(`${this.trustDeviceURL}` + '/register', JSON.stringify(deviceTokenRequest), { 'headers': headers, observe: 'response' })
  }

  public checkDeviceStatus(clinicId: number, deviceId: string) {
    return this.http.get<DeviceStatus>(`${this.trustDeviceURL}` + '/status/clinic-id/' + clinicId + '/device-id/' + deviceId)
  }

  public checkDeviceHealty(deviceInformation: DeviceInformation): Observable<any> {
    const headers = { 'content-type': 'application/json' }
    return this.http.post(`${this.trustDeviceURL}` + '/health', JSON.stringify(deviceInformation), { 'headers': headers, observe: 'response' })
  }
}
