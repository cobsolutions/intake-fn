import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientIdentityVerificationComponent } from './patient-identity-verification.component';

describe('PatientIdentityVerificationComponent', () => {
  let component: PatientIdentityVerificationComponent;
  let fixture: ComponentFixture<PatientIdentityVerificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientIdentityVerificationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientIdentityVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
