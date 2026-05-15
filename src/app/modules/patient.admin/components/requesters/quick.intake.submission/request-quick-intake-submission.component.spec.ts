import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestQuickIntakeSubmissionComponent } from './request-quick-intake-submission.component';

describe('RequestQuickIntakeSubmissionComponent', () => {
  let component: RequestQuickIntakeSubmissionComponent;
  let fixture: ComponentFixture<RequestQuickIntakeSubmissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestQuickIntakeSubmissionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestQuickIntakeSubmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
