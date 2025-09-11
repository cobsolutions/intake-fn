import { Component, Input, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { Survey } from '../../../models/survey/survey';
import { PatientSurveyService } from '../../../services/survey/patient-survey.service';

@Component({
  selector: 'survey-submission',
  templateUrl: './survey-submission.component.html',
  styleUrls: ['./survey-submission.component.css']
})
export class SurveySubmissionComponent implements OnInit {
  submissionApproach: string | undefined = undefined
  surveyId: number | undefined = undefined
  surveys: Survey[];
  @Input() patient: any
  constructor(private patientSurveyService: PatientSurveyService) { }

  ngOnInit(): void {
    this.patientSurveyService.getAll().pipe(
      map(data => data.body)
    )
      .subscribe((data: any) => {
        this.surveys = data
      })
  }

}
