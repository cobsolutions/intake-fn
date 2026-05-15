import { Component, Input, OnInit } from '@angular/core';
import { PatientSurveyResult } from '../../models/patient/surveys/patient.survey.result';
import { PatientSurveyService } from '../../services/survey/patient-survey.service';

@Component({
  selector: 'show-patient-survey',
  templateUrl: './show-patient-survey.component.html',
  styleUrls: ['./show-patient-survey.component.css']
})
export class ShowPatientSurveyComponent implements OnInit {
  @Input() patientId: number;
  surveyResults: PatientSurveyResult[];
  constructor(private patientSurveyService: PatientSurveyService) { }

  ngOnInit(): void {
    this.patientSurveyService.getPatientSurveys(this.patientId).subscribe((data: any) => {
      console.log(JSON.stringify(data))
      this.surveyResults = data.body;
    })
  }

}
