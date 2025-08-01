import { TestBed } from '@angular/core/testing';

import { PatientSignatureService } from './patient-signature.service';

describe('PatientSignatureService', () => {
  let service: PatientSignatureService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PatientSignatureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
