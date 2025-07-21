import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreCreateDigitalPatientIntakeComponentComponent } from './pre-create-digital-patient-intake-component.component';

describe('PreCreateDigitalPatientIntakeComponentComponent', () => {
  let component: PreCreateDigitalPatientIntakeComponentComponent;
  let fixture: ComponentFixture<PreCreateDigitalPatientIntakeComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreCreateDigitalPatientIntakeComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreCreateDigitalPatientIntakeComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
