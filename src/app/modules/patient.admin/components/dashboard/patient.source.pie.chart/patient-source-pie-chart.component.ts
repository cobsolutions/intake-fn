import { Component, Input, OnInit } from '@angular/core';
import { Chart, ChartData, ChartOptions } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import * as moment from 'moment';
import { map, Observable } from 'rxjs';
import { Clinic } from '../../../models/clinic.model';
import { DateMonth } from '../../../models/date.months';
import PatientSources from '../../../models/patient.sources';
import { DashboardService } from '../../../services/dashboard.service';
@Component({
  selector: 'patient-source-pie-chart',
  templateUrl: './patient-source-pie-chart.component.html',
  styleUrls: ['./patient-source-pie-chart.component.css']
})
export class PatientSourcePieChartComponent implements OnInit {
  @Input() clinics: Observable<Clinic[]>
  patientSources = PatientSources;
  dateMonths = DateMonth;
  pieChartData: ChartData<'pie'>;
  pieChartOptions: ChartOptions<'pie'>;
  selectedClinics: any;
  selectedSources: any;
  selectedDate: any

  constructor(private dashboardService: DashboardService) { }
  ngOnInit(): void {
    console.log('ngOnInit')
    this.prepareLookups();
    this.getData();

  }
  private prepareLookups() {
    this.patientSources = this.patientSources.map((source: any) => ({ ...source, selected: true }))
    const currentMonthIndex = moment().month() + 1;
    this.dateMonths.forEach(month => {
      month.selected = (month.index === currentMonthIndex);
    });
  }
  private getData(selectedclinics?: any, selectedSources?: any, selectedDate?: any) {
    this.selectedSources = selectedSources !== undefined ? selectedSources : this.initPatientSourceValues();
    this.selectedDate = selectedDate !== undefined ? selectedDate : this.initDate();

    this.clinics.subscribe(clinics => {
      this.selectedClinics = selectedclinics !== undefined ? selectedclinics : clinics.map(clinic => (clinic.id?.toString()));
      this.dashboardService.getGroupedPatientSource(this.selectedClinics, this.selectedSources, this.selectedDate).subscribe((data: any) => {
        this.pieChartData = {
          labels: this.patientSources.map(source => source.entityName),
          datasets: [{
            data: data.map((item: any) => item.count),
            backgroundColor: this.patientSources.map(source => source.color)
          }]
        }
        this.pieChartOptions = {
          plugins: {
            legend: {
              position: 'right'
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const count = context.raw as number;
                  const total = this.pieChartData.datasets[0].data.reduce((sum, value) => sum + (value as number), 0);
                  const percentage = ((count / total) * 100).toFixed(2);
                  return `${context.label}: ${count} (${percentage}%)`;
                }
              }
            }
          }
        };
      })
    })

  }

  private initPatientSourceName(): string[] {
    return this.patientSources.map(source => source.entityName)
  }
  private initPatientSourceValues(): string[] {
    return this.patientSources.map(source => source.entityValue)
  }
  private initPatientSourceColor(): string[] {
    return this.patientSources.map(source => source.color)
  }
  private initDate(): number[] {
    const currentMonthNumber = moment().month() + 1;
    return [currentMonthNumber];
  }
  changeClinics(event: any) {
    if (!(this.same(event, this.selectedClinics))) {
      this.getData(event, this.selectedSources, this.selectedDate);
    }
    this.selectedClinics = event;
  }
  changeDate(event: any) {
    if (!(this.same(event, this.selectedDate))) {
      this.getData(this.selectedClinics, this.selectedSources, event);
    }
    this.selectedDate = event;
  }
  changeSources(event: any) {
    if (!(this.same(event, this.selectedSources))) {
      this.getData(this.selectedClinics, event, this.selectedDate);
    }
    this.selectedSources = event;
  }
  private same(arr1: string[], arr2: string[]): boolean {
    // Check if arrays have the same length
    if (arr1.length !== arr2.length) return false;

    // Sort both arrays and compare each element
    const sortedArr1 = arr1.slice().sort();
    const sortedArr2 = arr2.slice().sort();

    return sortedArr1.every((value, index) => value === sortedArr2[index]);
  }
}
