import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'pre-create-quick-intake',
  templateUrl: './pre-create-quick-intake.component.html',
  styleUrls: ['./pre-create-quick-intake.component.css']
})
export class PreCreateQuickIntakeComponent implements OnInit {
  state: 'waiting' | 'done' = 'waiting';
  constructor() { 
    setTimeout(() => {
      this.state = 'done';
    }, 4000);
  }

  ngOnInit(): void {
  }

}
