import { TestBed } from '@angular/core/testing';

import { CacheClinicService } from './cache-clinic.service';

describe('CacheClinicService', () => {
  let service: CacheClinicService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CacheClinicService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
