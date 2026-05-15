import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PelvicSurveyComponent } from './pelvic-survey.component';

describe('PelvicSurveyComponent', () => {
  let component: PelvicSurveyComponent;
  let fixture: ComponentFixture<PelvicSurveyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PelvicSurveyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PelvicSurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
