import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, debounceTime, distinctUntilChanged, switchMap, retry, catchError, throwError } from 'rxjs';
import { PaginationData } from '../../models/pagination/pagination.data';
import { IApiParams } from '../patient-list.service';
const httpOptions = {
  // headers: new HttpHeaders({
  //   'Content-Type': 'application/json',
  //   'Access-Control-Allow-Origin': '*',
  //   Connection: 'keep-alive'
  // })
};
@Injectable({
  providedIn: 'root'
})
export class BasePaginationService {
  constructor(public httpClient: HttpClient) { }
  get(config$: BehaviorSubject<IApiParams>, url: string): Observable<any> {
    return config$.pipe(
      debounceTime(100),
      distinctUntilChanged(
        (previous, current) => {
          return JSON.stringify(previous) === JSON.stringify(current);
        }
      ),
      switchMap((config) => this.fetchData(config, url))
    );
  }
  post(config$: BehaviorSubject<IApiParams>, url: string, body: string): Observable<any> {
    return config$.pipe(
      debounceTime(100),
      distinctUntilChanged(
        (previous, current) => {
          return JSON.stringify(previous) === JSON.stringify(current);
        }
      ),
      switchMap((config) => this.fetchPostData(config,url, body))
    );
  }
  private fetchData(params: IApiParams, url: string): Observable<PaginationData> {
    const apiParams = {
      ...params
    };
    const httpParams: HttpParams = new HttpParams({ fromObject: apiParams });
    const options = Object.keys(httpParams).length
      ? { params: httpParams, ...httpOptions }
      : { params: {}, ...httpOptions };
    return this.httpClient
      .get<PaginationData>(url, options)
      .pipe(
        retry({ count: 1, delay: 100000, resetOnSuccess: true }),
        catchError(this.handleHttpError)
      )
  }
  private fetchPostData(params: IApiParams, url: string, body: string): Observable<PaginationData> {
    const apiParams = {
      ...params
    };
    const httpParams: HttpParams = new HttpParams({ fromObject: apiParams });
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    })
    const options = Object.keys(httpParams).length
      ? { params: httpParams, ...httpOptions, headers: headers }
      : { params: {}, ...httpOptions };
    return this.httpClient
      .post<PaginationData>(url, body, options)
      .pipe(
        retry({ count: 1, delay: 100000, resetOnSuccess: true }),
        catchError(this.handleHttpError)
      )
  }
  private handleHttpError(error: HttpErrorResponse) {
    return throwError(() => error);
  }
}
