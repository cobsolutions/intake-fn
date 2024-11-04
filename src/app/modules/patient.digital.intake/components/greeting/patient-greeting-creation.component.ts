import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-patient-greeting-creation',
  templateUrl: './patient-greeting-creation.component.html',
  styleUrls: ['./patient-greeting-creation.component.css']
})
export class PatientGreetingCreationComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.router.navigateByUrl('/digital-intake/create?clinicId=' + localStorage.getItem('clinicId'));
    }, 2000)
  }

}
