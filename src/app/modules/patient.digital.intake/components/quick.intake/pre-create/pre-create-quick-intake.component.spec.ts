import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreCreateQuickIntakeComponent } from './pre-create-quick-intake.component';

describe('PreCreateQuickIntakeComponent', () => {
  let component: PreCreateQuickIntakeComponent;
  let fixture: ComponentFixture<PreCreateQuickIntakeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreCreateQuickIntakeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreCreateQuickIntakeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
