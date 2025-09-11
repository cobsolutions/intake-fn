import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickIntakeAndSurveyComponent } from './quick-intake-and-survey.component';

describe('QuickIntakeAndSurveyComponent', () => {
  let component: QuickIntakeAndSurveyComponent;
  let fixture: ComponentFixture<QuickIntakeAndSurveyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuickIntakeAndSurveyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuickIntakeAndSurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
