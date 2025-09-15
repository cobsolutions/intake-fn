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
  @Input() clinics: Clinic[]
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
    this.buildChartOption();
    this.getData();
  }

  changeClinics(event: any) {
    if (!(this.same(event, this.selectedClinics))) {
      this.getData(event, this.selectedSources, this.selectedDate);
    }
    this.selectedClinics = event;
  }
  private buildChartOption() {
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
  changeSources(event: any) {
    if (!(this.same(event, this.selectedSources))) {
      this.getData(this.selectedClinics, event, this.selectedDate);
    }
    this.selectedSources = event;
  }
  changeDate(event: any) {
    if (!(this.same(event, this.selectedDate))) {
      this.getData(this.selectedClinics, this.selectedSources, event);
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
    this.patientSources = this.patientSources.map((source: any) => ({ ...source, selected: true })).filter(value => value.entityValue !== 'referringDoctor')
    const currentMonthIndex = moment().month() + 1;
    this.dateMonths.forEach(month => {
      month.selected = (month.index === currentMonthIndex);
    });
  }
  private getData(selectedclinics?: any, selectedSources?: any, selectedDate?: any) {
    this.selectedSources = selectedSources !== undefined ? selectedSources : this.initPatientSourceValues();
    this.selectedDate = selectedDate !== undefined ? selectedDate : this.initDate();

    this.selectedClinics = selectedclinics !== undefined ? selectedclinics : this.clinics.map(clinic => (clinic.id?.toString()));
    this.dashboardService.getPatientSourceDirectAccess(this.selectedClinics, this.selectedSources, this.selectedDate).subscribe((data: any) => {
      this.chartData = {
        labels: data.map((item: any) => item.patientSourceName),
        datasets: [
          {
            label: 'Source',
            data: data.map((item: any) => item.countWithReferringProvider),
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          },
          {
            label: 'Direct Access',
            data: data.map((item: any) => item.countWithDirectAccess),
            backgroundColor: 'rgba(153, 102, 255, 0.5)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1
          }
        ]
      }
    })

  }
  private initPatientSourceValues(): string[] {
    return this.patientSources.map(source => source.entityValue)
      .filter((value: any) => value.entityValue !== 'referringDoctor')
  }
  private initDate(): number[] {
    const currentMonthNumber = moment().month() + 1;
    return [currentMonthNumber];
  }
}
