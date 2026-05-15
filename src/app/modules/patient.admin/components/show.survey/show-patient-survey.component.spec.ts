import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowPatientSurveyComponent } from './show-patient-survey.component';

describe('ShowPatientSurveyComponent', () => {
  let component: ShowPatientSurveyComponent;
  let fixture: ComponentFixture<ShowPatientSurveyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowPatientSurveyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowPatientSurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
