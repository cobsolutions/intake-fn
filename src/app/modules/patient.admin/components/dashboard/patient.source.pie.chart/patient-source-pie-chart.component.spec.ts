import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientSourcePieChartComponent } from './patient-source-pie-chart.component';

describe('PatientSourcePieChartComponent', () => {
  let component: PatientSourcePieChartComponent;
  let fixture: ComponentFixture<PatientSourcePieChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientSourcePieChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientSourcePieChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
