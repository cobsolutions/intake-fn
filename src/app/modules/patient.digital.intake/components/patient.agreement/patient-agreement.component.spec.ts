import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientAgreementComponent } from './patient-agreement.component';

describe('PatientAgreementComponent', () => {
  let component: PatientAgreementComponent;
  let fixture: ComponentFixture<PatientAgreementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientAgreementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientAgreementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
