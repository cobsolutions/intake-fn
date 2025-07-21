import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProvidersService {
  private baseUrl = environment.baseURL + 'nppes'

  constructor(private httpClient: HttpClient) { }
  public findProviderByNPI(npi: number):Observable<any> {
    var url = this.baseUrl + '/find/provider/npi/' + npi;
    return this.httpClient.get(url);
  }

  public findProviderByFirstName(name: string):Observable<any> {
    var url = this.baseUrl + '/find/provider/f-name/' + name;
    return this.httpClient.get(url);
  }
  public findProviderByLastName(name: string):Observable<any> {
    var url = this.baseUrl + '/find/provider/l-name/' + name;
    return this.httpClient.get(url);
  }
  public findProviderByFullName(last: string,first: string):Observable<any> {
    var url = this.baseUrl + '/find/provider/f-name/' + first +'/l-name/'+ last;
    return this.httpClient.get(url);
  }
}
