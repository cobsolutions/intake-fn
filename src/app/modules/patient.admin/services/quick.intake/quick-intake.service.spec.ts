import { TestBed } from '@angular/core/testing';

import { QuickIntakeService } from './quick-intake.service';

describe('QuickIntakeService', () => {
  let service: QuickIntakeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuickIntakeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
