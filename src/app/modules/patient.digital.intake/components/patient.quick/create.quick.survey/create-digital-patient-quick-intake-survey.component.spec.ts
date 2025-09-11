import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDigitalPatientQuickIntakeSurveyComponent } from './create-digital-patient-quick-intake-survey.component';

describe('CreateDigitalPatientQuickIntakeSurveyComponent', () => {
  let component: CreateDigitalPatientQuickIntakeSurveyComponent;
  let fixture: ComponentFixture<CreateDigitalPatientQuickIntakeSurveyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateDigitalPatientQuickIntakeSurveyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateDigitalPatientQuickIntakeSurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
