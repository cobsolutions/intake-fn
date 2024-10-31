import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OptServiceService {
  private baseUrl = environment.baseURL + 'otp'
  constructor(private httpClient: HttpClient) { }
  send(customerId: string, phoneNumber: string) {
    let params = new HttpParams().set('customerId', customerId).append('phoneNumber', phoneNumber);
    var url = this.baseUrl + '/send';
    return this.httpClient.post(url, undefined, { params: params })
  }
  validate(customerId: string, otp: string) {
    var url = this.baseUrl + '/validate';
    let params = new HttpParams().set('customerId', customerId).append('otp', otp);
    return this.httpClient.post(url, undefined, { params: params })
  }
}
