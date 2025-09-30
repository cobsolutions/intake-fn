import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QuickIntakeService {
  private baseUrl = environment.baseURL + '/quick-intake/admin/'
  constructor(public httpClient: HttpClient) { }

  generateOTT(quickIntakeRequest: any){
    const headers = { 'content-type': 'application/json' }
    const url = this.baseUrl + 'generate/ott';
    return this.httpClient.post(url, JSON.stringify(quickIntakeRequest),{ 'headers': headers, observe: 'response' })
  }
}
