import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { result } from 'lodash';
import { BehaviorSubject, catchError, debounceTime, distinctUntilChanged, mergeMap, Observable, retry, switchMap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ClinicService } from './clinic/clinic.service';

const httpOptions = {
  // headers: new HttpHeaders({
  //   'Content-Type': 'application/json',
  //   'Access-Control-Allow-Origin': '*',
  //   Connection: 'keep-alive'
  // })
};

export interface IData {
  number_of_records: number;
  number_of_matching_records: number;
  records: IPatient[];
}

export interface IUsers {
  firstName: string;
  middleName: string;
  email: string;
  country: string;
  phoneType: string;
  phoneNumber: string;
  idType: string,
  patientId: string,
  tableId: number,
  patientSourceType: string,
  insuranceWorkerType: string,
  hasPhysicalTherapy: boolean
  isSchedule: boolean
  hasProvider: boolean
  createdAt: number;
  surveyStatus: string;
  isQuick: any
}

export interface IPatient {
  firstName: string,
  middleName: string,
  lastName: string,
  email: string
  phoneNumber: string,
  sourceType: string,
  insuranceType: string
  hasGuarantor: boolean;
  patientId: number
}

export interface IApiParams {
  currentPage?: number;
  pageSize?: number;
  clinicId?: number
  columnFilter?: string;
  columnSorter?: string;
  sort?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PatientListService {
  private baseUrl = environment.baseURL + 'patient'
  constructor(private httpClient: HttpClient, private clinicService: ClinicService) { }

  getPatients(config$: BehaviorSubject<IApiParams>): Observable<any> {
    return config$.pipe(
      debounceTime(100),
      distinctUntilChanged(
        (previous, current) => {
          return JSON.stringify(previous) === JSON.stringify(current);
        }
      ),
      switchMap((config) => this.fetchData(config))
    );
  }
  private fetchData(params: IApiParams): Observable<IData> {

    const apiParams = {
      ...params
    };
    const httpParams: HttpParams = new HttpParams({ fromObject: apiParams });

    const options = Object.keys(httpParams).length
      ? { params: httpParams, ...httpOptions }
      : { params: {}, ...httpOptions };
    return this.clinicService.selectedClinic$.pipe(
      switchMap(clinicId =>
        this.httpClient
          .get<IData>(this.baseUrl + "/find/clinic/" + clinicId, options)
          .pipe(
            retry({ count: 1, delay: 100000, resetOnSuccess: true }),
            catchError(this.handleHttpError)
          )
      ))
  }
  private handleHttpError(error: HttpErrorResponse) {
    return throwError(() => error);
  }

  updatePatientSchedule(patientId: number, isSchedulePatient: boolean) {
    const url = this.baseUrl + '/update/schedule/patientId/' + patientId + '/isSchedule/' + isSchedulePatient
    return this.httpClient.get(url)
  }
}
