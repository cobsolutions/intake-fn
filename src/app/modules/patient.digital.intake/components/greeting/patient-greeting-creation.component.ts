import { Component, OnInit } from '@angular/core';
import { DigitalIntakeOTTService } from 'src/app/modules/security/service/digital.intake.ott.service/digital-intake-ott.service';

@Component({
  selector: 'app-patient-greeting-creation',
  templateUrl: './patient-greeting-creation.component.html',
  styleUrls: ['./patient-greeting-creation.component.css']
})
export class PatientGreetingCreationComponent implements OnInit {

  constructor(private digitalIntakeOTTService:DigitalIntakeOTTService) { }

  ngOnInit(): void {
    this.digitalIntakeOTTService.evictToken()
    this.digitalIntakeOTTService.evictRequester();
  }

}
