import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-survey',
  templateUrl: './list-survey.component.html',
  styleUrls: ['./list-survey.component.css']
})
export class ListSurveyComponent implements OnInit {
  isSurvey: boolean
  constructor() { }

  ngOnInit(): void {
  }

  showPatientPelvicSurvey() {
    this.isSurvey = true;
  }
  togglePatientPelvicSurvey() {
    this.isSurvey = !this.isSurvey;
  }
}
