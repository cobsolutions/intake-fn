import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientCounterWidgetsComponent } from './patient-counter-widgets.component';

describe('PatientCounterWidgetsComponent', () => {
  let component: PatientCounterWidgetsComponent;
  let fixture: ComponentFixture<PatientCounterWidgetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientCounterWidgetsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientCounterWidgetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
