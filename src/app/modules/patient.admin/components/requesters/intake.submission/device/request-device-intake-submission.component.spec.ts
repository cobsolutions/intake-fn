import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestDeviceIntakeSubmissionComponent } from './request-device-intake-submission.component';

describe('RequestDeviceIntakeSubmissionComponent', () => {
  let component: RequestDeviceIntakeSubmissionComponent;
  let fixture: ComponentFixture<RequestDeviceIntakeSubmissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestDeviceIntakeSubmissionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestDeviceIntakeSubmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
