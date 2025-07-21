import { TestBed } from '@angular/core/testing';

import { PatientSourceReportingService } from './patient-source-reporting.service';

describe('PatientSourceReportingService', () => {
  let service: PatientSourceReportingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PatientSourceReportingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
