import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreCreatePatientSurveyComponent } from './pre-create-patient-survey.component';

describe('PreCreatePatientSurveyComponent', () => {
  let component: PreCreatePatientSurveyComponent;
  let fixture: ComponentFixture<PreCreatePatientSurveyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreCreatePatientSurveyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreCreatePatientSurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
