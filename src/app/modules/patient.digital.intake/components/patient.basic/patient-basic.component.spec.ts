import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientBasicComponent } from './patient-basic.component';

describe('PatientBasicComponent', () => {
  let component: PatientBasicComponent;
  let fixture: ComponentFixture<PatientBasicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientBasicComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientBasicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
