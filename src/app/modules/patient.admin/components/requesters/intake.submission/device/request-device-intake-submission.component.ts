import { Component, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ClinicService } from 'src/app/modules/patient.admin/services/clinic/clinic.service';

@Component({
  selector: 'request-device-intake-submission',
  templateUrl: './request-device-intake-submission.component.html',
  styleUrls: ['./request-device-intake-submission.component.css']
})
export class RequestDeviceIntakeSubmissionComponent implements OnInit {

  clinics$: Observable<any>
  constructor(private clinicService: ClinicService) { }

  ngOnInit(): void {
    this.getAllClinics()
  }
  private getAllClinics() {
    this.clinics$ = this.clinicService.get().pipe(
      map(result => result.body)
    )
  }

}
