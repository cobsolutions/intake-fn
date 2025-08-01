import { TestBed } from '@angular/core/testing';

import { PatientsCounterService } from './patients-counter.service';

describe('PatientsCounterService', () => {
  let service: PatientsCounterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PatientsCounterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
