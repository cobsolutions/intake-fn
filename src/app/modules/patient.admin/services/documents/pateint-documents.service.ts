import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PateintDocumentsService {
  private baseUrl = environment.baseURL + 'document/';

  constructor(private httpClient: HttpClient) { }

  exportPateintIdDocuments(patientId: number, hasGuarantor?: boolean) {
    const pateintIdDocumentsURL = this.baseUrl + 'id/patientId/' + patientId + '/hasGuarantor/' + hasGuarantor;
    return this.httpClient.get(pateintIdDocumentsURL, { responseType: 'blob' })
  }

  exportPateintInsuranceDocuments(patientId: number) {
    const pateintInsuranceDocuments = this.baseUrl + 'insurance/patientId/' + patientId;
    return this.httpClient.get(pateintInsuranceDocuments, { responseType: 'blob' })
  }
}
