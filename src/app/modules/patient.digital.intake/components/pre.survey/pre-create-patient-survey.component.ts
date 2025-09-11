import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { switchMap } from 'rxjs';
import { DigitalIntakeService } from '../../services/digitalIntake/digital-intake.service';

@Component({
  selector: 'app-pre-create-patient-survey',
  templateUrl: './pre-create-patient-survey.component.html',
  styleUrls: ['./pre-create-patient-survey.component.css']
})
export class PreCreatePatientSurveyComponent implements OnInit {
  isLoading: boolean = true
  token: string
  constructor(private route: ActivatedRoute,
    private digitalIntakeService: DigitalIntakeService,
    private cookieService: CookieService,
    private router: Router) { }

  ngOnInit(): void {
    console.log('PreCreatePatientSurveyComponent')
    this.route.queryParams.subscribe((param: any) => {
      this.token = param['token'];
      param['suryveyId'];
      param['patientId'];
      this.digitalIntakeService.assignTokenToRequesterTerminal().pipe(
        switchMap(result => this.digitalIntakeService.initDigitalIntakeRecord("Device"))
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
