import { TestBed } from '@angular/core/testing';

import { EmailBatchService } from './email-batch.service';

describe('EmailBatchService', () => {
  let service: EmailBatchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmailBatchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
