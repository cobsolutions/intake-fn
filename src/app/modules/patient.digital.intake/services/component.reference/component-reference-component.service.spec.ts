import { TestBed } from '@angular/core/testing';

import { ComponentReferenceComponentService } from './component-reference-component.service';

describe('ComponentReferenceComponentService', () => {
  let service: ComponentReferenceComponentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComponentReferenceComponentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
