import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreRegisterDeviceComponent } from './pre-register-device.component';

describe('PreRegisterDeviceComponent', () => {
  let component: PreRegisterDeviceComponent;
  let fixture: ComponentFixture<PreRegisterDeviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreRegisterDeviceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreRegisterDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
