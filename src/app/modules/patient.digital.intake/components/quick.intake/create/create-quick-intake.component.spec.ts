import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateQuickIntakeComponent } from './create-quick-intake.component';

describe('CreateQuickIntakeComponent', () => {
  let component: CreateQuickIntakeComponent;
  let fixture: ComponentFixture<CreateQuickIntakeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateQuickIntakeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateQuickIntakeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
