import { TestBed } from '@angular/core/testing';

import { CompressDocumentService } from './compress-document.service';

describe('CompressDocumentService', () => {
  let service: CompressDocumentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompressDocumentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
