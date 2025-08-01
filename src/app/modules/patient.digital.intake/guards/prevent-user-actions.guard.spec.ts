import { TestBed } from '@angular/core/testing';

import { PreventUserActionsGuard } from './prevent-user-actions.guard';

describe('PreventUserActionsGuard', () => {
  let guard: PreventUserActionsGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(PreventUserActionsGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
