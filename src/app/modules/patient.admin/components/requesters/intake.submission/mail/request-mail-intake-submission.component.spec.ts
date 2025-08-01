import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestMailIntakeSubmissionComponent } from './request-mail-intake-submission.component';

describe('RequestMailIntakeSubmissionComponent', () => {
  let component: RequestMailIntakeSubmissionComponent;
  let fixture: ComponentFixture<RequestMailIntakeSubmissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestMailIntakeSubmissionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestMailIntakeSubmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
