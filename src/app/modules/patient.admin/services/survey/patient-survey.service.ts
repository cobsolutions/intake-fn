import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Survey } from '../../models/create.survey/survey.model';


@Injectable({
  providedIn: 'root'
})
export class PatientSurveyService {

  private baseUrl = environment.baseURL + 'survey/'
  constructor(private httpClient: HttpClient) { }
  getAll() {
    var url: string = this.baseUrl + 'find/all'
    console.log(url)
    return this.httpClient.get<Survey[]>(url, { observe: 'response' })
  }
  getActive() {
    var url: string = this.baseUrl + 'find/active'
    console.log(url)
    return this.httpClient.get<Survey[]>(url, { observe: 'response' })
  }
  create(model: Survey) {
    const headers = { 'content-type': 'application/json' }
    const url = this.baseUrl + "/create"
    return this.httpClient.post(url, JSON.stringify(model), { 'headers': headers, observe: 'response' })
  }
  update(model: Survey) {
    const headers = { 'content-type': 'application/json' }
    const url = this.baseUrl + "update/" + model.id 
    return this.httpClient.put(url, JSON.stringify(model), { 'headers': headers, observe: 'response' })
  }
}
