import { Component, OnInit } from '@angular/core';
import { map, tap } from 'rxjs';
import { PaginationListTemplate } from 'src/app/modules/common/template/pagination.list.template';
import { PatientChangesService } from '../../../services/monitor/patient-changes.service';

@Component({
  selector: 'app-chnages-report',
  templateUrl: './chnages-report.component.html',
  styleUrls: ['./chnages-report.component.css']
})
export class ChnagesReportComponent extends PaginationListTemplate implements OnInit {
  constructor(private patientChangesService:PatientChangesService) {super(); }

  ngOnInit(): void {
    this.patientChangesService.find(this.apiParams$,1,'tee','Update_Referring_Provider')
    .pipe(
      tap((response: any) => {
        this.totalItems$.next(response.number_of_matching_records);
        if (response.number_of_records) {
          this.errorMessage$.next('');
        }
        this.retry$.next(false);
        this.loadingData$.next(false);
      }),
      map((response: any) => {
        return response.records;
      })
    ).subscribe(dd=>{
      console.log(JSON.stringify(dd))
    })
  }

}
