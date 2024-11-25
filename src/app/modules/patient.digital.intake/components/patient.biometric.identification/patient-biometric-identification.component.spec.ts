import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientBiometricIdentificationComponent } from './patient-biometric-identification.component';

describe('PatientBiometricIdentificationComponent', () => {
  let component: PatientBiometricIdentificationComponent;
  let fixture: ComponentFixture<PatientBiometricIdentificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientBiometricIdentificationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientBiometricIdentificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
