import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientGreetingCreationComponent } from './patient-greeting-creation.component';

describe('PatientGreetingCreationComponent', () => {
  let component: PatientGreetingCreationComponent;
  let fixture: ComponentFixture<PatientGreetingCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientGreetingCreationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientGreetingCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
