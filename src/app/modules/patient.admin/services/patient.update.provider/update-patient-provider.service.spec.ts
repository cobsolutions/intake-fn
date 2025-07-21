import { TestBed } from '@angular/core/testing';

import { UpdatePatientProviderService } from './update-patient-provider.service';

describe('UpdatePatientProviderService', () => {
  let service: UpdatePatientProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpdatePatientProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
