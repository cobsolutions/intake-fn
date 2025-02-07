import { TestBed } from '@angular/core/testing';

import { FindPatientProviderService } from './find-patient-provider.service';

describe('FindPatientProviderService', () => {
  let service: FindPatientProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FindPatientProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
