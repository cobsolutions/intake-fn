import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveySubmissionComponent } from './survey-submission.component';

describe('SurveySubmissionComponent', () => {
  let component: SurveySubmissionComponent;
  let fixture: ComponentFixture<SurveySubmissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SurveySubmissionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SurveySubmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
