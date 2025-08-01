import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientSourceBarChartComponent } from './patient-source-bar-chart.component';

describe('PatientSourceBarChartComponent', () => {
  let component: PatientSourceBarChartComponent;
  let fixture: ComponentFixture<PatientSourceBarChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientSourceBarChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientSourceBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
