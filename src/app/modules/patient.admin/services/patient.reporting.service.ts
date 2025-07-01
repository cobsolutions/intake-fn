import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PatientSearchCriteria } from 'src/app/models/reporting/patient.search.criteria';
import { environment } from 'src/environments/environment';
import { PatientChangesRecord } from '../models/monitor/patient.changes.record';
import { ExportPatientSourceReportRequest } from '../models/report/export.patient.source.report.request';
import { IUsers } from './patient-list.service';
export interface IPatientResult {
  firstName: string;
  middleName: string;
  email: string;
  country: string;
  phoneType: string;
  phoneNumber: string;
  idType: string,
  patientId: string
  createdAt: number,
  gender: string,
  patientSourceType: string,
  referringProviderName: string,
  referringProviderNPI: string,
  organizationName: string
}
export interface ISearchResult {
  resultCount: number;
  result: IPatientResult[];
}
@Injectable({
  providedIn: 'root'
})
export class PatientReportingService {
  private baseUrl = environment.baseURL + 'reports/';
  constructor(private httpClient: HttpClient) { }

  search(searchCriteria: PatientSearchCriteria) {
    if (searchCriteria.type === 'null') {
      searchCriteria.type = null;
    }
    const headers = { 'content-type': 'application/json' }
    const changePatientRequiredFieldsURL = this.baseUrl + 'search';
    return this.httpClient.post(changePatientRequiredFieldsURL, JSON.stringify(searchCriteria), { 'headers': headers })
  }

  export(request: ExportPatientSourceReportRequest) {
    const headers = { 'content-type': 'application/json' }
    const changePatientRequiredFieldsURL = this.baseUrl + 'generator/excel';
    return this.httpClient.post(changePatientRequiredFieldsURL, JSON.stringify(request), { 'headers': headers, responseType: 'blob' })
  }

  exportPatientchanges(records: PatientChangesRecord[]) {
    const headers = { 'content-type': 'application/json' }
    const changePatientRequiredFieldsURL = this.baseUrl + 'generator/excel/changes'
    return this.httpClient.post(changePatientRequiredFieldsURL, JSON.stringify(records), { 'headers': headers, responseType: 'blob' })
  }
  
  exportPatientContact(records: IUsers[]) {
    const headers = { 'content-type': 'application/json' }
    const changePatientRequiredFieldsURL = this.baseUrl + 'generator/excel/contact'
    return this.httpClient.post(changePatientRequiredFieldsURL, JSON.stringify(records), { 'headers': headers, responseType: 'blob' })
  }

  exportPDF(patientId: number) {
    const exportPDFURL = this.baseUrl + 'generator/pdf/patientId/' + patientId
    const headers = { 'Content-Type': 'application/pdf', 'Accept': 'application/pdf', 'responseType': 'blob' };
    return this.httpClient.post(exportPDFURL, { location: "report.pdf" }, { responseType: 'blob' })
  }

  exportNewPDF(patientId: number) {
    const exportPDFURL = environment.baseURL + 'pdf/intake/patientId/' + patientId
    const headers = { 'Content-Type': 'application/pdf', 'Accept': 'application/pdf', 'responseType': 'blob' };
    return this.httpClient.post(exportPDFURL, { location: "report.pdf" }, { responseType: 'blob' })
  }
}
