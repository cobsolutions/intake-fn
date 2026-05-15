import { TestBed } from '@angular/core/testing';

import { DigitalIntakeInterceptor } from './digital-intake.interceptor';

describe('DigitalIntakeInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      DigitalIntakeInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: DigitalIntakeInterceptor = TestBed.inject(DigitalIntakeInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
