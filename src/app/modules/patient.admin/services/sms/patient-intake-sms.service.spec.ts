import { TestBed } from '@angular/core/testing';

import { PatientIntakeSMSService } from './patient-intake-sms.service';

describe('PatientIntakeSMSService', () => {
  let service: PatientIntakeSMSService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PatientIntakeSMSService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
