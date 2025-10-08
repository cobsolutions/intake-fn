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
    this.route.queryParams.subscribe(params => {
      const tokenId: string = params['token-id'];
      this.digitalIntakeService.initiate().subscribe((response: any) => {
        const submissionType: string = response.result
        switch (submissionType) {
          case 'FUll':
            this.router.navigate(['/digital-intake/device-create-request'], {
              queryParams: {
                'token-id': tokenId
              }
            });
            break;
          case 'Quick':
            this.router.navigate(['/digital-intake/quick/device-submission-request'], {
              queryParams: {
                'token-id': tokenId
              }
            });
            break;
        }
        this.isLoading = false

      })
    })
  }

}
