import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePatientSurveyComponent } from './create-patient-survey.component';

describe('CreatePatientSurveyComponent', () => {
  let component: CreatePatientSurveyComponent;
  let fixture: ComponentFixture<CreatePatientSurveyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatePatientSurveyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatePatientSurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
