import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-corrupted-device',
  templateUrl: './corrupted-device.component.html',
  styleUrls: ['./corrupted-device.component.css']
})
export class CorruptedDeviceComponent implements OnInit {
  errorMessage: number;
  constructor(private router: Router) { }

  ngOnInit(): void {
    const error: any = JSON.parse(localStorage.getItem('device-error') || '{}');
    localStorage.removeItem('device-error');
    this.errorMessage = error.message;
  }

}
