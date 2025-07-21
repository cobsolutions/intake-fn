import { Component, OnInit } from '@angular/core';
import { filter, switchMap } from 'rxjs';
import { ClinicService } from '../../services/clinic/clinic.service';

@Component({
  selector: 'app-patient-create',
  templateUrl: './patient-create.component.html',
  styleUrls: ['./patient-create.component.css']
})
export class PatientCreateComponent implements OnInit {
  public createPatientURL: string
  public clinicId: number | null;
  public baseURL: string = location.origin;
  submissionApproach:string | undefined =undefined
  constructor(private clinicService: ClinicService) { }

  ngOnInit(): void {
    // this.clinicService.selectedClinic$.subscribe(clinicId => {
    //   this.clinicId = clinicId
    //   this.createPatientURL = this.baseURL + '/digital-intake?clinicId=' + clinicId;
    // })
    // this.createPatientURL = this.baseURL + '/digital-intake?clinicId=' + this.clinicId
    this.getClinicUUID();
  }

  private getClinicUUID() {
    this.clinicService.selectedClinic$.pipe(
      filter((clinicId) => clinicId !== null),
      switchMap((clinicId: any) => this.clinicService.getById(clinicId))
    ).subscribe((clinic: any) => {
      this.createPatientURL = this.baseURL + '/digital-intake/create?clinicId=' + clinic.uuid;
    })
  }
}
