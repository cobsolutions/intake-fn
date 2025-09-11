import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'render-survey',
  templateUrl: './render-survey.component.html',
  styleUrls: ['./render-survey.component.css']
})
export class RenderSurveyComponent implements OnInit {
  @Input() token: string;
  @Input() surveyId: number
  @Input() patientId: number
  constructor() { }

  ngOnInit(): void {
    console.log(this.token)
    console.log(this.surveyId)
    console.log(this.patientId)
  }

}
