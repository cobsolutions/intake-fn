import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-patient-contact-report',
  templateUrl: './patient-contact-report.component.html',
  styleUrls: ['./patient-contact-report.component.css']
})
export class PatientContactReportComponent implements OnInit {

  contactType: string|null = null;
  contactTime: string|null = null;
  patientName:string

  constructor() { }

  ngOnInit(): void {
  }
  search() {
    throw new Error('Method not implemented.');
    }
}
