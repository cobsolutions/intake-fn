import { TestBed } from '@angular/core/testing';

import { PatientSurveyService } from './patient-survey.service';

describe('PatientSurveyService', () => {
  let service: PatientSurveyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PatientSurveyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
