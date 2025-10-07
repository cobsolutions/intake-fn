import { TestBed } from '@angular/core/testing';

import { PatientIntakeMailService } from './patient-intake-mail.service';

describe('PatientIntakeMailService', () => {
  let service: PatientIntakeMailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PatientIntakeMailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
