import { Component, OnInit } from '@angular/core';
import { ClinicService } from '../../services/clinic/clinic.service';

@Component({
  selector: 'app-patient-create',
  templateUrl: './patient-create.component.html',
  styleUrls: ['./patient-create.component.css']
})
export class PatientCreateComponent implements OnInit {
  public createPatientURL: string
  public clinicId:number | null;
  public baseURL:string = location.origin ;
  constructor(private clinicService: ClinicService) { }

  ngOnInit(): void {
    this.clinicService.selectedClinic$.subscribe(clinicId => {
      this.clinicId = clinicId
      this.createPatientURL = this.baseURL + '/digital-intake?clinicId=' + clinicId;
    })
    this.createPatientURL = this.baseURL + '/digital-intake'
  }

}
