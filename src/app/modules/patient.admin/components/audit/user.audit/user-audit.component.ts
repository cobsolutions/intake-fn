import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from 'src/app/modules/security/model/user';
import { UserService } from '../../../services/user/user.service';
import { UserClinicAuditComponent } from './user.clinic.audit/user-clinic-audit.component';
import { UserInsuranceCompanyAuditComponent } from './user.insurance.company.audit/user-insurance-company-audit.component';
import { UserPatientAuditComponent } from './user.patient.audit/user-patient-audit.component';

@Component({
  selector: 'app-user-audit',
  templateUrl: './user-audit.component.html',
  styleUrls: ['./user-audit.component.css']
})
export class UserAuditComponent implements OnInit {
  selectedUser: string = ''
  searchInputNotValid: boolean = false;
  errorMsg: string;
  users: User[] = new Array();
  items = [1, 2, 3];
  @ViewChild(UserClinicAuditComponent) clinicAuditComponent: UserClinicAuditComponent;
  @ViewChild(UserInsuranceCompanyAuditComponent) insuranceCompanyAuditComponent: UserInsuranceCompanyAuditComponent;
  @ViewChild(UserPatientAuditComponent) patientAuditComponent: UserPatientAuditComponent;
  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.get().subscribe(response => {
      console.log(JSON.stringify(response.body))
      response.body?.forEach(element => {
        this.users?.push(element)
      });
    },
      error => {
        console.log(error)
      },
    )
  }

  find() {
    var isNotValid = this.isSearchCriteriaEmpty();
    if (isNotValid) {
      this.errorMsg = 'Please select User name ';
      this.searchInputNotValid = true;
    } else {
      this.searchInputNotValid = false;
      this.clinicAuditComponent.fetchData();
      this.insuranceCompanyAuditComponent.fetchData();
      this.patientAuditComponent.fetchData();
    }
  }
  private isSearchCriteriaEmpty(): boolean {
    return (this.selectedUser === '')
  }
}
