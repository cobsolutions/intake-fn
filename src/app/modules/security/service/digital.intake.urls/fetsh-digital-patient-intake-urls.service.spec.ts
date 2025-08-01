import { TestBed } from '@angular/core/testing';

import { FetshDigitalPatientIntakeUrlsService } from './fetsh-digital-patient-intake-urls.service';

describe('FetshDigitalPatientIntakeUrlsService', () => {
  let service: FetshDigitalPatientIntakeUrlsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FetshDigitalPatientIntakeUrlsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
