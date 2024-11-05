import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AgreementHolder } from 'src/app/models/patient/agreements/agreements.holder';
import { InsuranceCompany } from 'src/app/modules/patient.admin/models/insurance.company.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DigitalIntakeService {
  private baseUrl = environment.baseURL + 'digital-intake'
  constructor(private http: HttpClient) { }
  create(imageFormData: FormData) {
    const createPatientURL = this.baseUrl + '/create';
    return this.http.post(createPatientURL, imageFormData)
  }
  findAgreements() {
    const findAgreementURL = this.baseUrl + '/find/agreement';
    return this.http.get<AgreementHolder[]>(findAgreementURL, { observe: 'response' })
  }
  findInsuranceCompanybyName(name: string) {
    const findInsuranceCompanyURL = this.baseUrl + '/find/name/';
    return this.http.get<InsuranceCompany[]>(`${findInsuranceCompanyURL}` + name, { observe: 'response' })
  }
  public findProviderByNPI(npi: number):Observable<any> {
    var url = this.baseUrl + '/find/provider/npi/' + npi;
    return this.http.get(url);
  }

  public findProviderByFirstName(name: string):Observable<any> {
    var url = this.baseUrl + '/find/provider/f-name/' + name;
    return this.http.get(url);
  }
  public findProviderByLastName(name: string):Observable<any> {
    var url = this.baseUrl + '/find/provider/l-name/' + name;
    return this.http.get(url);
  }
  public findProviderByFullName(last: string,first: string):Observable<any> {
    var url = this.baseUrl + '/find/provider/f-name/' + first +'/l-name/'+ last;
    return this.http.get(url);
  }
}
