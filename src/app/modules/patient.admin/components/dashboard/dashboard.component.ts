import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { cilArrowTop, cilOptions } from '@coreui/icons';
import * as moment from 'moment';
import { BehaviorSubject, combineLatest, filter, map, Observable, switchMap, tap } from 'rxjs';
import { DashboardDataContainer } from 'src/app/models/dashboard/dashboard.data.container';
import { KcAuthServiceService } from 'src/app/modules/security/service/kc/kc-auth-service.service';
import { Clinic } from '../../models/clinic.model';
import { ClinicService } from '../../services/clinic/clinic.service';
import { DashboardService } from '../../services/dashboard.service';
import { PatientsCounterService } from '../../services/patient.counters/patients-counter.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  clinics$!: Observable<Clinic[]>;
  constructor(private clinicService: ClinicService) { }
  ngOnInit(): void {
    this.clinics$ = this.clinicService.getObservable().pipe(
      map(result => result.body.map((clinic:any) => ({ ...clinic, selected: true })))
    );
  }
  ngOnDestroy() {
  }
}
