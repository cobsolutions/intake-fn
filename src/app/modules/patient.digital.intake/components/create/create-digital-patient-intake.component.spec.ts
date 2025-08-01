import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDigitalPatientIntakeComponent } from './create-digital-patient-intake.component';

describe('CreateDigitalPatientIntakeComponent', () => {
  let component: CreateDigitalPatientIntakeComponent;
  let fixture: ComponentFixture<CreateDigitalPatientIntakeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateDigitalPatientIntakeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateDigitalPatientIntakeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
