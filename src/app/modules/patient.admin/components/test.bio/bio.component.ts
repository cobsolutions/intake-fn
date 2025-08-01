import { Component, OnInit } from '@angular/core';
import { BioService } from '../../services/bio/bio.service';

@Component({
  selector: 'app-bio',
  templateUrl: './bio.component.html',
  styleUrls: ['./bio.component.css']
})
export class BioComponent implements OnInit {
  message: string | null = null; // Message to display feedback to the user
  isSuccess: boolean = false; // Indicates if the last action was successful
  constructor(private webAuthnService: BioService) { }

  ngOnInit(): void {
  }
  // Trigger registration process and update the UI based on the outcome
  async register() {
    try {
      await this.webAuthnService.register();
      this.message = "Registration successful!"; // Success message if registration works
      this.isSuccess = true;
    } catch (err) {
      this.message = "Registration failed. Please try again."; // Error message if something goes wrong
      this.isSuccess = false;
    }
  }
  async login() {
    try {
      await this.webAuthnService.authenticate();
      this.message = "Authentication successful!"; // Success message if authentication works
      this.isSuccess = true;
    } catch (err) {
      this.message = "Authentication failed. Please try again."; // Error message if something goes wrong
      this.isSuccess = false;
    }
  }

}
