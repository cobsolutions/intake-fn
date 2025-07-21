import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTrustDevicesComponent } from './list-trust-devices.component';

describe('ListTrustDevicesComponent', () => {
  let component: ListTrustDevicesComponent;
  let fixture: ComponentFixture<ListTrustDevicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListTrustDevicesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListTrustDevicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
