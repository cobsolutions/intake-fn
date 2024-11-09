import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'patient-source-bar-chart',
  templateUrl: './patient-source-bar-chart.component.html',
  styleUrls: ['./patient-source-bar-chart.component.css']
})
export class PatientSourceBarChartComponent implements OnInit {

  constructor() { }
  data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'GitHub Commits',
        backgroundColor: '#f87979',
        data: [40, 20, 12, 39, 10, 80, 40]
      }
    ]
  };
  ngOnInit(): void {
  }

}
