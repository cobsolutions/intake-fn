import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreenCampainComponent } from './screen-campain.component';

describe('ScreenCampainComponent', () => {
  let component: ScreenCampainComponent;
  let fixture: ComponentFixture<ScreenCampainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScreenCampainComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScreenCampainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
