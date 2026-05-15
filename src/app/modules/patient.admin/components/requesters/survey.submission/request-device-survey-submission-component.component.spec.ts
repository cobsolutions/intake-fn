import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestDeviceSurveySubmissionComponentComponent } from './request-device-survey-submission-component.component';

describe('RequestDeviceSurveySubmissionComponentComponent', () => {
  let component: RequestDeviceSurveySubmissionComponentComponent;
  let fixture: ComponentFixture<RequestDeviceSurveySubmissionComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestDeviceSurveySubmissionComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestDeviceSurveySubmissionComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
