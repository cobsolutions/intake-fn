import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestDeviceRegistrationComponent } from './request-device-registration.component';

describe('RequestDeviceRegistrationComponent', () => {
  let component: RequestDeviceRegistrationComponent;
  let fixture: ComponentFixture<RequestDeviceRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestDeviceRegistrationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestDeviceRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
