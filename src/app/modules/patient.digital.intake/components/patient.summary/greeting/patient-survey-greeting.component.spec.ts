import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientSurveyGreetingComponent } from './patient-survey-greeting.component';

describe('PatientSurveyGreetingComponent', () => {
  let component: PatientSurveyGreetingComponent;
  let fixture: ComponentFixture<PatientSurveyGreetingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientSurveyGreetingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientSurveyGreetingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
