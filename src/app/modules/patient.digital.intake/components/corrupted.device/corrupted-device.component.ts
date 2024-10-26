import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-corrupted-device',
  templateUrl: './corrupted-device.component.html',
  styleUrls: ['./corrupted-device.component.css']
})
export class CorruptedDeviceComponent implements OnInit {
  errorCode: number;
  constructor(private router: Router) { }

  ngOnInit(): void {
    var error = history.state.errorCode;
    if (error !== undefined)
      this.errorCode = error.code;
  }

}
