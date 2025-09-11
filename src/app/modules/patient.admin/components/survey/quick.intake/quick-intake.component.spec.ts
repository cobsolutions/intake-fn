import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickIntakeComponent } from './quick-intake.component';

describe('QuickIntakeComponent', () => {
  let component: QuickIntakeComponent;
  let fixture: ComponentFixture<QuickIntakeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuickIntakeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuickIntakeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
