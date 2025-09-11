import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'survey-submission',
  templateUrl: './survey-submission.component.html',
  styleUrls: ['./survey-submission.component.css']
})
export class SurveySubmissionComponent implements OnInit {
  submissionApproach:string | undefined =undefined
  surveyType:string | undefined =undefined
  @Input() patient:any
  constructor() { }

  ngOnInit(): void {
  }

}
