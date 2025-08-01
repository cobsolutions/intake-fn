import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { IColumn } from '@coreui/angular-pro/lib/smart-table/smart-table.type';
import * as moment from 'moment';
import { map, Observable, retry, tap } from 'rxjs';
import { PaginationListTemplate } from 'src/app/modules/common/template/pagination.list.template';
import { Audit } from 'src/app/modules/patient.admin/models/audit.model';
import { AuditService } from 'src/app/modules/patient.admin/services/audit/audit.service';
import { UserAuditPatientService } from 'src/app/modules/patient.admin/services/audit/user.audit/user-audit-patient.service';
import AuditColumns from '../../utils/audit.columns';
import { AuditModelMapper } from '../../utils/audit.mapper';

@Component({
  selector: 'app-user-patient-audit',
  templateUrl: './user-patient-audit.component.html',
  styleUrls: ['./user-patient-audit.component.css']
})
export class UserPatientAuditComponent extends PaginationListTemplate implements OnInit {
  @Input() uuid: string
  constructor(private auditService: UserAuditPatientService, private sanitizer: DomSanitizer) { super(); }
  pauditData$!: Observable<Audit[]>;
  details_visible = Object.create({});
  patientcolumns: (IColumn | string)[] = AuditColumns;
  
  ngOnInit(): void {
    this.initListComponent();
  }
  fetchData() {
    this.auditService.uuid = this.uuid;
    this.pauditData$ = this.auditService.get(this.apiParams$).pipe(
      retry({
        delay: (error) => {
          console.warn('Retry: ', error);
          this.errorMessage$.next(error.message ?? `Error: ${JSON.stringify(error)}`);
          this.loadingData$.next(false);
          return this.retry$;
        }
      }),
      tap((response: any) => {
        this.totalItems$.next(response.count);
        if (response.count) {
          this.errorMessage$.next('');
        }
        this.retry$.next(false);
        this.loadingData$.next(false);
      }),
      map((response: any) => {
        return AuditModelMapper.map(response.auditModels);
      })
    );
  }
  toggleDetails(item: any) {
    this.details_visible[item] = !this.details_visible[item];
  }
  getBadge(status: string) {
    switch (status) {
      case 'created':
        return 'primary'
      case 'modified':
        return 'warning'
      case 'deleted':
        return 'danger'
    }
  }
  showClinicValues(entity: any) {
    let paragraph = `<strong>Patient Values</strong> </br>`;
    for (const key in entity) {
      if (key === 'patientName') {
        paragraph = paragraph + `${key}: ${entity[key].firstName} , ${entity[key].lastName} </br>`;
      }
      if (key === 'patientPhone') {
        paragraph = paragraph + `Phone Type: ${entity[key].phoneType} </br> Phone:  ${entity[key].phone} </br>`;
      }
      if (key === 'dateOfBirth') {
        paragraph = paragraph + `${key}: ${moment(entity[key]).format("MM/DD/YYYY")} </br>`;
      }
      if (key === 'email') {
        paragraph = paragraph + `${key}: ${entity[key]} </br>`;
      }
      if (key === 'insuranceWorkerType') {
        paragraph = paragraph + `${key}: ${entity[key]} </br>`;
      }
    }
    return this.sanitizer.bypassSecurityTrustHtml(paragraph);
  }
}
