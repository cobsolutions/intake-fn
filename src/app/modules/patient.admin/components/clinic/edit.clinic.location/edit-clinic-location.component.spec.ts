import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditClinicLocationComponent } from './edit-clinic-location.component';

describe('EditClinicLocationComponent', () => {
  let component: EditClinicLocationComponent;
  let fixture: ComponentFixture<EditClinicLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditClinicLocationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditClinicLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
