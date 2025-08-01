import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FailedPatientComponent } from './failed-patient.component';

describe('FailedPatientComponent', () => {
  let component: FailedPatientComponent;
  let fixture: ComponentFixture<FailedPatientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FailedPatientComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FailedPatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
