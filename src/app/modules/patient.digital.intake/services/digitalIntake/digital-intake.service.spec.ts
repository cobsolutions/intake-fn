import { TestBed } from '@angular/core/testing';

import { DigitalIntakeService } from './digital-intake.service';

describe('DigitalIntakeService', () => {
  let service: DigitalIntakeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DigitalIntakeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
