import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientContactReportComponent } from './patient-contact-report.component';

describe('PatientContactReportComponent', () => {
  let component: PatientContactReportComponent;
  let fixture: ComponentFixture<PatientContactReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientContactReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientContactReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
