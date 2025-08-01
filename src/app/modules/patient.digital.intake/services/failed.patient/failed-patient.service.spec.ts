import { TestBed } from '@angular/core/testing';

import { FailedPatientService } from './failed-patient.service';

describe('FailedPatientService', () => {
  let service: FailedPatientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FailedPatientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
