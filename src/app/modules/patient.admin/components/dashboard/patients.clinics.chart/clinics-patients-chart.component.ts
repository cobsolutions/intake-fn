import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { filter, map, Observable, tap } from 'rxjs';
import { ColorsPool } from 'src/app/modules/common/components/color/color.pool';
import { Clinic } from '../../../models/clinic.model';
import { DashboardService } from '../../../services/dashboard/dashboard.service';
import { PatientsCounterService } from '../../../services/patient.counters/patients-counter.service';
import { ChartMonths } from '../patient.counters.widgets/chart.months';
interface Year {
  value: string,
  selected: boolean
}
@Component({
  selector: 'clinics-patients-chart',
  templateUrl: './clinics-patients-chart.component.html',
  styleUrls: ['./clinics-patients-chart.component.css']
})
export class ClinicsPatientsChartComponent implements OnInit, AfterViewInit {
  @Input() clinics: Observable<Clinic[]>
  years: Year[] = [];
  colors: string[] = ColorsPool;
  data$: Observable<any>
  selectedYears: number;
  selectedClinics: any;
  options: any = {};
  constructor(private dashboardService: DashboardService) { }
  ngOnInit(): void {
    this.prepareYears();
    this.getData();
  }
  ngAfterViewInit(): void {
  }
  private random_rgba() {
    var o = Math.round, r = Math.random, s = 255;
    return 'rgba(' + o(r() * s) + ',' + o(r() * s) + ',' + o(r() * s) + ',' + r().toFixed(1) + ')';
  }
  private prepareYears() {
    const currentYear = new Date().getFullYear();
    for (let i = 0; i <= 5; i++) {
      var year: Year = {
        value: (currentYear - i).toString(),
        selected: i === 0 ? true : false,
      }
      this.years.push(year);
    }
  }
  changeClinics(event: any) {
    if (!this.same(event, this.selectedClinics))
      this.getData(event, this.selectedYears);
  }
  changeDate(event: any) {
    if (!(event === this.selectedYears))
      this.getData(this.selectedClinics, event);
  }
  private getData(selectedclinics?: any, selectedYears?: any) {
    this.clinics.subscribe(clinics => {
      if (selectedclinics !== undefined && selectedclinics.length === 0)
        selectedclinics = [-1]
      this.selectedClinics = selectedclinics !== undefined ? selectedclinics : clinics.map(clinic => (clinic.id?.toString()));
      this.selectedYears = selectedYears !== undefined ? selectedYears : Number(this.years[0].value);
      this.data$ = this.dashboardService.getTotalPatient(this.selectedYears, this.selectedClinics)
        .pipe(
          filter(result => result !== null),
          map((result: any) => {
            var mappedData: any = {
              labels: ChartMonths,
              datasets: []
            }
            if (result.length === 0)
              return mappedData;
            var mappedDatasets: any[] = []
            const clinicCounts: { [clinic: string]: number[] } = {};
            result.forEach((item: any) => {
              if (!clinicCounts[item.clinicName]) {
                // Initialize the array for this clinic with 12 zeros
                clinicCounts[item.clinicName] = new Array(12).fill(0);
              }
              // Subtract 1 from month to get the correct array index (0-based index)
              clinicCounts[item.clinicName][item.month - 1] = item.count;
            });
            var counter: number = 0;
            Object.keys(clinicCounts).forEach(key => {
              counter++
              var color = this.colors[counter]
              var ds: any = {
                label: key,
                backgroundColor: color,
                borderColor: color,

                pointBorderColor: color,
                data: clinicCounts[key]
              }
              mappedDatasets.push(ds);
            })
            mappedData.datasets = mappedDatasets;
            return mappedData;
          })
        )
    })
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
