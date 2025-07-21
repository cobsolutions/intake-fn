import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BasePaginationService } from '../base.pagination/base-pagination.service';
import { ClinicService } from '../clinic/clinic.service';
import { IApiParams } from '../patient-list.service';

@Injectable({
  providedIn: 'root'
})
export class FailedServiceService extends BasePaginationService {
  private baseUrl = environment.baseURL + 'patient/'
  constructor(httpClient: HttpClient, private clinicService: ClinicService) { super(httpClient) }

  find(config$: BehaviorSubject<IApiParams>) {
    return this.clinicService.selectedClinic$.pipe(
      switchMap((id: any) => {
        const url = this.baseUrl + 'find/failed/clinic/' + id;
        return this.get(config$, url)
      })
    )
  }
}
