import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Clinic } from '../../../models/clinic.model';
import { ClinicService } from '../../../services/clinic/clinic.service';
interface RenderedClinic {
  id?: number | null,
  name?: string | null,
  address?: string | null,
  country?: string | null,
  ps?: string | null,
  zipcode?: string | null
  createdAt?:number
}
@Component({
  selector: 'app-clinic.list',
  templateUrl: './clinic.list.component.html',
  styleUrls: ['./clinic.list.component.css']
})

export class ClinicListComponent implements OnInit {
  errorMessage: string | null = '';
  clinics: RenderedClinic[] | null = new Array();
  isCreateClinic: boolean = false;
  isEditClinic: boolean = false;
  isEditClinicLocation: boolean = false;
  selectedClinicId: number;
  constructor(private router: Router, private clinicService: ClinicService) { }

  ngOnInit(): void {
    this.getClinics();
  }

  getClinics() {
    this.clinicService.get().subscribe(response => {
      this.clinics = [];
      response.body?.forEach(element => {
        this.clinics?.push(this.constructClinic(element))
      });
    },
      error => {
        console.log(error)
      },
    )
  }
  private constructClinic(element: Clinic) {
    var address: string = '';
    address = element.clinicAddress?.firstAddress
      + ',' + element.clinicAddress?.city
      + ',' + element.clinicAddress?.state
      + ',' + element.clinicAddress?.zipCode
    var renderedClinic: RenderedClinic = {
      id: element.id,
      name: element.name,
      address: address,
      createdAt:element.createdAt
    }
    return renderedClinic;
  }
  update(id: number | undefined | null) {
    this.router.navigate(['/admin/clinic/update', id])
  }

  deleteClinic(id: number | undefined | null) {
    this.clinicService.delete(id?.toString() || '{}').subscribe(() => {
      this.errorMessage = ''
      location.reload();
    }, error => {
      this.errorMessage = error.error.message;
    },
    )
  }
  showCreateClinic() {
    this.isCreateClinic = true;
  }
  toggleCreateClinic() {
    this.isCreateClinic = !this.isCreateClinic;
  }
  changeClinicVisibility(event: any) {
    if (event === 'close-create')
      this.isCreateClinic = false;
    if (event === 'close-edit')
      this.isEditClinic = false;
    this.getClinics();
  }
  changeClinicLocationVisibility(event: any){
      if(event ==='close')
      this.isEditClinicLocation = false
  }

  showEditClinic(clinicId: number | undefined | null) {
    this.selectedClinicId = clinicId!;
    this.isEditClinic = true;
  }
  showLocation(clinicId: number | undefined | null) {
    this.selectedClinicId = clinicId!;
    this.isEditClinicLocation = true;
  }
  toggleEditClinic() {
    this.isEditClinic = !this.isEditClinic;
  }
  toggleEditClinicLocation() {
    this.isEditClinicLocation = !this.isEditClinicLocation;
  }
}
