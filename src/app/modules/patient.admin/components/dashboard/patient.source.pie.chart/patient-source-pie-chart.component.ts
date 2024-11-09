import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'patient-source-pie-chart',
  templateUrl: './patient-source-pie-chart.component.html',
  styleUrls: ['./patient-source-pie-chart.component.css']
})
export class PatientSourcePieChartComponent implements OnInit {
  data = {
    labels: ['Red', 'Green', 'Yellow', 'Grey', 'Blue'],
    datasets: [
      {
        data: [11, 16, 7, 3, 14],
        backgroundColor: ['#FF6384', '#4BC0C0', '#FFCE56', '#E7E9ED', '#36A2EB']
      }
    ]
  };
  constructor() { }

  ngOnInit(): void {
  }

}
