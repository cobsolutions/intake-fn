import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { INavData } from '@coreui/angular-pro';
import { BehaviorSubject, of, tap, timeoutWith } from 'rxjs';
import { LocalService } from 'src/app/modules/common';
import { ClinicService } from 'src/app/modules/patient.admin/services/clinic/clinic.service';
import { KcAuthServiceService } from 'src/app/modules/security/service/kc/kc-auth-service.service';
import { adminNavItems } from './_adminnav';
import { userNavItems } from './_usernav';

@Component({
  selector: 'app-default-admin-layout',
  templateUrl: './default-admin-layout.component.html',
  styleUrls: ['./default-admin-layout.component.css']
})
export class DefaultAdminLayoutComponent implements OnInit {
  navItems: INavData[] | null;
  noShow: BehaviorSubject<boolean | null>;
  constructor(private clinicService: ClinicService,
    private kcUserService: KcAuthServiceService,
    private router: Router) { }
  public perfectScrollbarConfig = {
    suppressScrollX: true,
  };
  ngOnInit(): void {
    this.noShow = this.clinicService.preventUser$
    this.setNavItems();
  }
  private setNavItems() {
    if (this.kcUserService.isUserInRole('normal')) {
      this.navItems = userNavItems
      this.router.navigateByUrl('/admin/patient/list');
    }
    if (this.kcUserService.isUserInRole('administrator')) {
      this.navItems = adminNavItems;
      this.router.navigateByUrl('/admin/dashboard');
    }

  }
}
