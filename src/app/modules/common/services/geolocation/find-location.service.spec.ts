import { TestBed } from '@angular/core/testing';

import { FindLocationService } from './find-location.service';

describe('FindLocationService', () => {
  let service: FindLocationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FindLocationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
