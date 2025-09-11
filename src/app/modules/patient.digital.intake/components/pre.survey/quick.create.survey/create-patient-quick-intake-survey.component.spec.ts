import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePatientQuickIntakeSurveyComponent } from './create-patient-quick-intake-survey.component';

describe('CreatePatientQuickIntakeSurveyComponent', () => {
  let component: CreatePatientQuickIntakeSurveyComponent;
  let fixture: ComponentFixture<CreatePatientQuickIntakeSurveyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatePatientQuickIntakeSurveyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatePatientQuickIntakeSurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
