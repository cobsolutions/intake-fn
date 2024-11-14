import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestIntakeSubmissionComponent } from './request-intake-submission.component';

describe('RequestIntakeSubmissionComponent', () => {
  let component: RequestIntakeSubmissionComponent;
  let fixture: ComponentFixture<RequestIntakeSubmissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestIntakeSubmissionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestIntakeSubmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
