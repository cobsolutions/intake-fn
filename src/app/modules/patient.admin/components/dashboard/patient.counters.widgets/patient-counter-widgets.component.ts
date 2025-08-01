import { Component, OnInit } from '@angular/core';
import { cilArrowTop, cilOptions } from '@coreui/icons';
import { map, tap } from 'rxjs';
import { PatientsCounterService } from '../../../services/patient.counters/patients-counter.service';
import { OptionsDefault } from './chart.defautl.options';
import { ChartMonths } from './chart.months';

@Component({
  selector: 'patient-counter-widgets',
  templateUrl: './patient-counter-widgets.component.html',
  styleUrls: ['./patient-counter-widgets.component.css']
})
export class PatientCounterWidgetsComponent implements OnInit {
  icons = { cilOptions, cilArrowTop };
  options: any = {};
  totalPatientsChart: any = {};
  totalPatients: number = 0;

  totalPatientsDoctorSourceChart: any = {};
  totalPatientsDoctorSource: number = 0;

  totalPatientsEntitySourceChart: any = {};
  totalPatientsEntitySource: number = 0;
  constructor(private patientsCounterService: PatientsCounterService) { }

  ngOnInit(): void {
    this.patientsCounterService.selectedYear$
      .pipe(
         map(result => {
          if (result === null)
            return new Date().getFullYear();
          else
            return result;
        })
      )
      .subscribe((selectedYear: any) => {
        this.getTotalPatients(selectedYear);
      })
    this.options = OptionsDefault;
  }
  private getTotalPatients(selectedYear: number) {
    this.patientsCounterService.totalPatients(selectedYear).subscribe((result: any) => {
      var totalPatientsDatasets = [
        {
          label: 'Patients',
          backgroundColor: 'transparent',
          borderColor: 'rgba(255,255,255,.55)',
          data: result
        }
      ];
      this.totalPatientsChart = {
        labels: ChartMonths,
        datasets: totalPatientsDatasets
      }
      this.totalPatients= 0;
      for (var i = 0; i < result.length; i++) {
        this.totalPatients = this.totalPatients + result[i];
      }
    })
    this.patientsCounterService.totalPatientsDoctorSource(selectedYear).subscribe((result: any) => {
      var totalPatientsDoctorSourceDatasets = [
        {
          label: 'Patients Doctor Source',
          backgroundColor: 'transparent',
          borderColor: 'rgba(255,255,255,.55)',
          data: result
        }
      ];
      this.totalPatientsDoctorSourceChart = {
        labels: ChartMonths,
        datasets: totalPatientsDoctorSourceDatasets
      }
      this.totalPatientsDoctorSource = 0
      for (var i = 0; i < result.length; i++) {
        this.totalPatientsDoctorSource = this.totalPatientsDoctorSource + result[i];
      }
    })
    this.patientsCounterService.totalPatientsEntitySource(selectedYear).subscribe((result: any) => {
      var totalPatientsEntitySourceDatasets = [
        {
          label: 'Patients Entity Source',
          backgroundColor: 'transparent',
          borderColor: 'rgba(255,255,255,.55)',
          data: result
        }
      ];
      this.totalPatientsEntitySourceChart = {
        labels: ChartMonths,
        datasets: totalPatientsEntitySourceDatasets
      }
      this.totalPatientsEntitySource = 0
      for (var i = 0; i < result.length; i++) {
        this.totalPatientsEntitySource = this.totalPatientsEntitySource + result[i];
      }
    })
  }

}
