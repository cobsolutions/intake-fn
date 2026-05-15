import { TestBed } from '@angular/core/testing';

import { DigitalIntakeOTTService } from './digital-intake-ott.service';

describe('DigitalIntakeOTTService', () => {
  let service: DigitalIntakeOTTService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DigitalIntakeOTTService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
