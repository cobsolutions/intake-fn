import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorruptedDeviceComponent } from './corrupted-device.component';

describe('CorruptedDeviceComponent', () => {
  let component: CorruptedDeviceComponent;
  let fixture: ComponentFixture<CorruptedDeviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CorruptedDeviceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CorruptedDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
