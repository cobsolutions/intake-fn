import { TestBed } from '@angular/core/testing';

import { OptServiceService } from './opt-service.service';

describe('OptServiceService', () => {
  let service: OptServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OptServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
