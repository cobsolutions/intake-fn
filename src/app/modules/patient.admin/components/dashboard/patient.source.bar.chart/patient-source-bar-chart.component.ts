import { Component, Input, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { Clinic } from '../../../models/clinic.model';
import { DateMonth } from '../../../models/date.months';
import PatientSources from '../../../models/patient.sources';
import { DashboardService } from '../../../services/dashboard.service';

@Component({
  selector: 'patient-source-bar-chart',
  templateUrl: './patient-source-bar-chart.component.html',
  styleUrls: ['./patient-source-bar-chart.component.css']
})
export class PatientSourceBarChartComponent implements OnInit {
  @Input() clinics: Observable<Clinic[]>
  selectedClinics: any;
  selectedSources: any;
  selectedDate: any
  patientSources = PatientSources;
  dateMonths = DateMonth;
  public barChart: any;
  public chartData: any;
  public chartOptions: any;
  constructor(private dashboardService: DashboardService) { }
  ngOnInit(): void {
    this.prepareLookups();
    this.getData();  
    this.chartData = {
      labels: ['Google', 'TV', 'Newspaper', 'Referral','Zocdoc','Soical','mail','other'],
      datasets: [
        {
          label: 'Count Source',
          data: [30, 45, 12, 25,33,12,54,87],
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        },
        {
          label: 'Direct Access',
          data: [10, 20, 8, 15,65,87,87,98],
          backgroundColor: 'rgba(153, 102, 255, 0.5)',
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 1
        }
      ]
    };

    this.chartOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top'
        },
        datalabels: {
          anchor: 'end',
          align: 'top',
          formatter: (value: number) => value,
          font: {
            weight: 'bold'
          }
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Patient Source'
          }
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Count'
          }
        }
      }
    };  
  }

  changeClinics(event: any) {
    if (!(this.same(event, this.selectedClinics))) {
      //this.getData(event, this.selectedSources, this.selectedDate);
    }
    this.selectedClinics = event;
  }
  changeSources(event: any) {
    if (!(this.same(event, this.selectedSources))) {
      // this.getData(this.selectedClinics, event, this.selectedDate);
    }
    this.selectedSources = event;
  }
  changeDate(event: any) {
    if (!(this.same(event, this.selectedDate))) {
      // this.getData(this.selectedClinics, this.selectedSources, event);
    }
    this.selectedDate = event;
  }
  private same(arr1: string[], arr2: string[]): boolean {
    // Check if arrays have the same length
    if (arr1.length !== arr2.length) return false;

    // Sort both arrays and compare each element
    const sortedArr1 = arr1.slice().sort();
    const sortedArr2 = arr2.slice().sort();

    return sortedArr1.every((value, index) => value === sortedArr2[index]);
  }
  private prepareLookups() {
    this.patientSources = this.patientSources.map((source: any) => ({ ...source, selected: true }))
    const currentMonthIndex = moment().month() + 1;
    this.dateMonths.forEach(month => {
      month.selected = (month.index === currentMonthIndex);
    });
  }
  private getData(selectedclinics?: any, selectedSources?: any, selectedDate?: any){
    this.selectedSources = selectedSources !== undefined ? selectedSources : this.initPatientSourceValues();
    this.selectedDate = selectedDate !== undefined ? selectedDate : this.initDate();
    this.clinics.subscribe(clinics=>{
      this.selectedClinics = selectedclinics !== undefined ? selectedclinics : clinics.map(clinic => (clinic.id?.toString()));
      this.dashboardService.getPatientSourceDirectAccess(this.selectedClinics, this.selectedSources, this.selectedDate).subscribe(data=>{
        console.log(JSON.stringify(data))
      })
    })
  }
  private initPatientSourceValues(): string[] {
    return this.patientSources.map(source => source.entityValue)
  }
  private initDate(): number[] {
    const currentMonthNumber = moment().month() + 1;
    return [currentMonthNumber];
  }
}
