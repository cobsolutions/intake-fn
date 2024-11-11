import { TestBed } from '@angular/core/testing';

import { BasePaginationService } from './base-pagination.service';

describe('BasePaginationService', () => {
  let service: BasePaginationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BasePaginationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
