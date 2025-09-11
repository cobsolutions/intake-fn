import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { switchMap } from 'rxjs';
import { DigitalIntakeService } from '../../../services/digitalIntake/digital-intake.service';

@Component({
  selector: 'create-patient-quick-intake-survey',
  templateUrl: './create-patient-quick-intake-survey.component.html',
  styleUrls: ['./create-patient-quick-intake-survey.component.css']
})
export class CreatePatientQuickIntakeSurveyComponent implements OnInit {

  isLoading: boolean = true
  token: string
  suryveyId: number;
  constructor(private route: ActivatedRoute,
    private digitalIntakeService: DigitalIntakeService,
    private cookieService: CookieService,
    private router: Router) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((param: any) => {
      this.token = param['token'];
      this.suryveyId = param['suryveyId'];
      // this.digitalIntakeService.assignTokenToRequesterTerminal().pipe(
      //   switchMap(result => this.digitalIntakeService.initDigitalIntakeRecord("Device"))
      // )
      //   .subscribe(result => {
      //     this.isLoading = false
      //     this.router.navigate(['/digital-intake/create-survey'], {
      //       queryParams: {
      //         'token': this.token,
      //         'surveyId': this.suryveyId,
      //         'patientId': this.patientId
      //       }
      //     });
      //   })
    })
  }

}
