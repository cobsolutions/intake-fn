import { TestBed } from '@angular/core/testing';

import { DigitalIntakeGuard } from './digital-intake.guard';

describe('DigitalIntakeGuard', () => {
  let guard: DigitalIntakeGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(DigitalIntakeGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
