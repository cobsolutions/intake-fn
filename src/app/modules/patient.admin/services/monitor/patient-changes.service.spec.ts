import { TestBed } from '@angular/core/testing';

import { PatientChangesService } from './patient-changes.service';

describe('PatientChangesService', () => {
  let service: PatientChangesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PatientChangesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
