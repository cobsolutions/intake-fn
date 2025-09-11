import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'create-patient-survey',
  templateUrl: './create-patient-survey.component.html',
  styleUrls: ['./create-patient-survey.component.css']
})
export class CreatePatientSurveyComponent implements OnInit {
  token: string;
  surveyId: number;
  patientId: number;
  survey: any;
  headers: any = {}
  isQuick: boolean;
  @Input() createdPatient: number;
  constructor(private http: HttpClient,
    private route: ActivatedRoute) {
    this.route.queryParams.subscribe((param: any) => {
      this.token = param['token'];
      this.surveyId = param['surveyId'];
      this.patientId = param['patientId'];
      console.log('$$$$ ' + this.createdPatient)
      this.patientId = (param['patientId'] === undefined || param['patientId'] === null) ? this.createdPatient : param['patientId'];
      this.headers = {
        'content-type': 'application/json',
        'token': param['token']
      }
    })
  }

  ngOnInit(): void {


  }

}
