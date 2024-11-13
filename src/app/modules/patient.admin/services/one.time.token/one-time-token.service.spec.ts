import { TestBed } from '@angular/core/testing';

import { OneTimeTokenService } from './one-time-token.service';

describe('OneTimeTokenService', () => {
  let service: OneTimeTokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OneTimeTokenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
