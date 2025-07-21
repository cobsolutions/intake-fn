import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { switchMap } from 'rxjs';
import { DigitalIntakeService } from '../../services/digitalIntake/digital-intake.service';

@Component({
  selector: 'pre-create-digital-patient-intake-component',
  templateUrl: './pre-create-digital-patient-intake-component.component.html',
  styleUrls: ['./pre-create-digital-patient-intake-component.component.css']
})
export class PreCreateDigitalPatientIntakeComponentComponent implements OnInit {
  isLoading: boolean = true
  token: string
  constructor(private route: ActivatedRoute,
    private digitalIntakeService: DigitalIntakeService,
    private cookieService: CookieService,
    private router: Router) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((param: any) => {
      this.token = param['token'];
      this.digitalIntakeService.assignTokenToRequesterTerminal().pipe(
        switchMap(result=>this.digitalIntakeService.initDigitalIntakeRecord("Device"))
      )
      .subscribe(result => {
        this.isLoading = false
        this.router.navigate(['/digital-intake/create'], {
          queryParams: {
            'token': this.token
          }
        });
      })
    })
  }

}
