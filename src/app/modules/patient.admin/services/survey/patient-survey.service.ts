import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Survey } from '../../models/survey/survey';

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
}
