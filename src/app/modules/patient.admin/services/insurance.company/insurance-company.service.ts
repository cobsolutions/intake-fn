import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { InsuranceCompany } from '../../models/insurance.company.model';

@Injectable({
  providedIn: 'root'
})
export class InsuranceCompanyService {
  private userUrl = environment.baseURL + 'insurance/company'
  constructor(private http: HttpClient) { }
  create(insuranceCompany: InsuranceCompany) {
    const headers = { 'content-type': 'application/json' }
    return this.http.post(`${this.userUrl}`+'/create', JSON.stringify(insuranceCompany), { 'headers': headers, observe: 'response' })
  }
  get() {
    return this.http.get<InsuranceCompany[]>(`${this.userUrl}` + '/find', { observe: 'response' })
  }
  checkName(name: string) {
    return this.http.get(`${this.userUrl}` + '/check/' + name, { observe: 'response' })
  }
  getById(id:number) {
    return this.http.get<InsuranceCompany[]>(`${this.userUrl}` + '/find/'+id, { observe: 'response' })
  }
  getbyName(name:string){
    return this.http.get<InsuranceCompany[]>(`${this.userUrl}` + '/find/name/'+name, { observe: 'response' })
  }
}
