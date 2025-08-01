import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { IColumn } from '@coreui/angular-pro/lib/smart-table/smart-table.type';
import * as moment from 'moment';
import { map, Observable, retry, tap } from 'rxjs';
import { PaginationListTemplate } from 'src/app/modules/common/template/pagination.list.template';
import { User } from 'src/app/modules/security/model/user';
import { Audit } from '../../models/audit.model';
import { AuditService } from '../../services/audit/audit.service';
import AuditColumns from './utils/audit.columns';
import { AuditModelMapper } from './utils/audit.mapper';

@Component({
  selector: 'app-audit',
  templateUrl: './audit.component.html',
  styleUrls: ['./audit.component.css']
})
export class AuditComponent extends PaginationListTemplate implements OnInit {
  searchInputNotValid: boolean = false;
  errorMsg: string;
  users: User[] = new Array();
  selectedUser: string = ''
  selectedEntity: string = '';

  auditData$!: Observable<Audit[]>;
  columns: (IColumn | string)[] = AuditColumns;
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
  details_visible = Object.create({});

  constructor(private auditService: AuditService, private sanitizer: DomSanitizer) {
    super();
  }

  ngOnInit(): void {
    this.initListComponent();
  }


  find() {
    var isNotValid = this.isSearchCriteriaEmpty();
    if (isNotValid) {
      this.errorMsg = 'Please select Audit Entity ';
      this.searchInputNotValid = true;
    } else {
      this.searchInputNotValid = false;
      this.auditService.constructOffsetURL(this.selectedEntity);
      this.auditData$ = this.auditService.get(this.apiParams$).pipe(
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
  }
  exportResult() { }
  private isSearchCriteriaEmpty(): boolean {
    return ( this.selectedEntity === '')
  }
  toggleDetails(item: any) {
    this.details_visible[item] = !this.details_visible[item];
  }

  showEntityData(entity: any, entityName: string) {
    if (entityName === 'ClinicEntity')
      return this.showClinicValues(entity)
    if (entityName === 'InsuranceCompanyEntity')
      return this.showInsuranceCompanyValues(entity)
    if (entityName === 'PatientEntity')
      return this.showPatientValues(entity);
  }
  showClinicValues(entity: any) {
    let paragraph = `<strong>Clinic Values</strong> </br>`;
    for (const key in entity) {
      if(key ==='name')
      paragraph = paragraph + `${key}: ${entity[key]} </br>`;
      if(key ==='address')
      paragraph = paragraph + `${key}: ${entity[key]} </br>`;
    }
    return this.sanitizer.bypassSecurityTrustHtml(paragraph);
  }
  showInsuranceCompanyValues(entity:any) {
    let paragraph = `<strong>Insurance Company Values</strong> </br>`;
    for (const key in entity) {
      if(key ==='name')
      paragraph = paragraph + `${key}: ${entity[key]} </br>`;
    }
    return this.sanitizer.bypassSecurityTrustHtml(paragraph);
  }
  showPatientValues(entity: any) {
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
