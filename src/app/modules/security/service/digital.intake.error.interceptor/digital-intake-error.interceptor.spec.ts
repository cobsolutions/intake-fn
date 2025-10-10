import { TestBed } from '@angular/core/testing';

import { DigitalIntakeErrorInterceptor } from './digital-intake-error.interceptor';

describe('DigitalIntakeErrorInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      DigitalIntakeErrorInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: DigitalIntakeErrorInterceptor = TestBed.inject(DigitalIntakeErrorInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
