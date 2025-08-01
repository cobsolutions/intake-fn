import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClinicsPatientsChartComponent } from './clinics-patients-chart.component';

describe('ClinicsPatientsChartComponent', () => {
  let component: ClinicsPatientsChartComponent;
  let fixture: ComponentFixture<ClinicsPatientsChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClinicsPatientsChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClinicsPatientsChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
