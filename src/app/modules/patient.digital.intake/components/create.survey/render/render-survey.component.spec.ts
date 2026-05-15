import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenderSurveyComponent } from './render-survey.component';

describe('RenderSurveyComponent', () => {
  let component: RenderSurveyComponent;
  let fixture: ComponentFixture<RenderSurveyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RenderSurveyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RenderSurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
