import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientsurveyReportComponent } from './patientsurvey-report.component';

describe('PatientsurveyReportComponent', () => {
  let component: PatientsurveyReportComponent;
  let fixture: ComponentFixture<PatientsurveyReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientsurveyReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientsurveyReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
