import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DigitalIntakeService } from '../../services/digitalIntake/digital-intake.service';

@Component({
  selector: 'app-patient-greeting-creation',
  templateUrl: './patient-greeting-creation.component.html',
  styleUrls: ['./patient-greeting-creation.component.css']
})
export class PatientGreetingCreationComponent implements OnInit {

  constructor(private router: Router, private digitalIntakeService: DigitalIntakeService) { }

  ngOnInit(): void {
    this.digitalIntakeService.invalidateToken().subscribe(result => {
    }, error => {
      localStorage.setItem('device-error', JSON.stringify(error));
      this.router.navigate(['/digital-intake/corrupted']);
    });
  }

}
