import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-corrupted-device',
  templateUrl: './corrupted-device.component.html',
  styleUrls: ['./corrupted-device.component.css']
})
export class CorruptedDeviceComponent implements OnInit {
  errorMessage: string = '';
  constructor(private router: Router) { }

  ngOnInit(): void {
    try {
      const raw = localStorage.getItem('device-error');
      if (raw) {
        const error: any = JSON.parse(raw);
        this.errorMessage = error?.error?.message ?? '';
      }
    } catch {
      this.errorMessage = '';
    }
    localStorage.removeItem('device-error');
  }
}
