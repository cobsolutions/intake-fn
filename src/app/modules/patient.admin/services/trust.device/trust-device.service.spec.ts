import { TestBed } from '@angular/core/testing';

import { TrustDeviceService } from './trust-device.service';

describe('TrustDeviceService', () => {
  let service: TrustDeviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrustDeviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
