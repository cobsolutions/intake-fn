import { Component, OnDestroy, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Clinic } from '../../models/clinic.model';
import { ClinicService } from '../../services/clinic/clinic.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  clinics: Clinic[];
  constructor(private clinicService: ClinicService) { }
  ngOnInit(): void {
    this.clinicService.getObservable().pipe(
      map(result => result.body.map((clinic: any) => ({ ...clinic, selected: true })))
    ).subscribe(clinics => {
      this.clinics = clinics;
    })
  }
  ngOnDestroy() {
  }
}
