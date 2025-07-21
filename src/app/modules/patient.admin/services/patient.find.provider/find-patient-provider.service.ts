import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FindPatientProviderService {
  baseUrl: string = environment.baseURL + 'patient'
  headers = { 'content-type': 'application/json' }
  constructor(private http: HttpClient) { }
  public findProviderByNPI(npi: number): Observable<any> {
    var url = this.baseUrl + '/find/provider/npi/' + npi;
    return this.http.get(url, { observe: 'response', withCredentials: true, 'headers': this.headers });
  }

  public findProviderByFirstName(name: string): Observable<any> {
    var url = this.baseUrl + '/find/provider/f-name/' + name;
    return this.http.get(url, { observe: 'response', withCredentials: true, 'headers': this.headers });
  }
  public findProviderByLastName(name: string): Observable<any> {
    var url = this.baseUrl + '/find/provider/l-name/' + name;
    return this.http.get(url, { observe: 'response', withCredentials: true, 'headers': this.headers });
  }
  public findProviderByFullName(last: string, first: string): Observable<any> {
    var url = this.baseUrl + '/find/provider/f-name/' + first + '/l-name/' + last;
    return this.http.get(url, { observe: 'response', withCredentials: true, 'headers': this.headers });
  }
}
