import { TestBed } from '@angular/core/testing';

import { FailedServiceService } from './failed-service.service';

describe('FailedServiceService', () => {
  let service: FailedServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FailedServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
