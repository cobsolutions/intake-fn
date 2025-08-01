import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientSignatureComponent } from './patient-signature.component';

describe('PatientSignatureComponent', () => {
  let component: PatientSignatureComponent;
  let fixture: ComponentFixture<PatientSignatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientSignatureComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientSignatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
