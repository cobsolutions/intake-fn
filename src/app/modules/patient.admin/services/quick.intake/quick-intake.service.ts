import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { QuickIntakeRequest } from '../../models/quick.intake/quickIntake.request';

@Injectable({
  providedIn: 'root'
})
export class QuickIntakeService {
  private adminBaseUrl = environment.baseURL + '/quick-intake/admin/'
  private baseUrl = environment.baseURL + 'digital-intake/quick-intake'
  constructor(public httpClient: HttpClient) { }

  generateOTT(quickIntakeRequest: QuickIntakeRequest) {
    const headers = { 'content-type': 'application/json' }
    const url = this.adminBaseUrl + 'generate/ott';
    return this.httpClient.post(url, JSON.stringify(quickIntakeRequest), { 'headers': headers, observe: 'response' })
  }

  preCreate(token: string, requester: string, deviceId?: string) {
    var headers;
    if (deviceId !== undefined)
      headers = { 'content-type': 'application/json', 'token': token, 'device-id': deviceId }
    else
      headers = { 'content-type': 'application/json', 'token': token }
    const url = this.baseUrl + '/pre-create';
    let params = new HttpParams().set('requester', requester);
    return this.httpClient.post(url, null, { 'headers': headers, observe: 'response', params: params })
  }
}
