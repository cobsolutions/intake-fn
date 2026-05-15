import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InsuranceCompany } from '../../../models/insurance.company.model';
import { InsuranceCompanyService } from '../../../services/insurance.company/insurance-company.service';

@Component({
  selector: 'app-insurance-company-list',
  templateUrl: './insurance-company-list.component.html',
  styleUrls: ['./insurance-company-list.component.scss']
})
export class InsuranceCompanyListComponent implements OnInit {

  InsuranceCompanies: InsuranceCompany[] = new Array();
  original: any[] = [];
  isCreateInsuranceCompany: boolean = false;
  isEditInsuranceCompany: boolean = false;
  selectedInsuranceCompanyId: number;
  searchQuery: string = '';
  constructor(private router: Router, private insuranceCompanyService: InsuranceCompanyService) { }

  ngOnInit(): void {
    this.getInsuranceCompanies();
  }
  private getInsuranceCompanies() {
    this.InsuranceCompanies = []
    this.original = []
    this.insuranceCompanyService.get().subscribe((response) => {
      response.body?.forEach(element => {
        this.InsuranceCompanies?.push(element);
        this.original.push(element)
      });
    })
  }
  showCreateInsuranceCompany() {
    this.isCreateInsuranceCompany = true;
  }
  toggleCreateInsuranceCompany() {
    this.isCreateInsuranceCompany = !this.isCreateInsuranceCompany;
  }
  changeClinicVisibility(event: any) {
    if (event === 'close-create')
      this.isCreateInsuranceCompany = false;
    if (event === 'close-edit')
      this.isEditInsuranceCompany = false;
    this.getInsuranceCompanies();
  }
  showEditInsuranceCompany(id: number | undefined | null) {
    this.selectedInsuranceCompanyId = id!;
    this.isEditInsuranceCompany = true;
  }
  toggleEditInsuranceCompany() {
    this.isEditInsuranceCompany = !this.isEditInsuranceCompany;
  }
  onSearchChange(): void {
    const query = (this.searchQuery || '').trim().toLowerCase();

    if (!query) {
      // restore full list if search box is empty
      this.InsuranceCompanies = [...this.original];
      return;
    }

    this.InsuranceCompanies = this.original.filter(icompany =>
      icompany.name.toLowerCase().includes(query) 
    );
  }
  onSearchClick() {
    this.onSearchChange();
  }
}
