import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPatientProviderComponent } from './edit-patient-provider.component';

describe('EditPatientProviderComponent', () => {
  let component: EditPatientProviderComponent;
  let fixture: ComponentFixture<EditPatientProviderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditPatientProviderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPatientProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
