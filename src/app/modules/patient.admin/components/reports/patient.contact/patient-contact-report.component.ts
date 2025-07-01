import { Component, OnInit } from '@angular/core';
import { PaginationListTemplate } from 'src/app/modules/common/template/pagination.list.template';

@Component({
  selector: 'app-patient-contact-report',
  templateUrl: './patient-contact-report.component.html',
  styleUrls: ['./patient-contact-report.component.css']
})
export class PatientContactReportComponent extends PaginationListTemplate implements OnInit {

  contactType: string|null = null;
  contactTime: string|null = null;
  patientName:string

  constructor() {super();  }

  ngOnInit(): void {
  }
  search() {
    throw new Error('Method not implemented.');
    }
    exportResult() {
      throw new Error('Method not implemented.');
      }
      
}
