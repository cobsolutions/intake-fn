import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScannerlayoutComponent } from './scannerlayout.component';

describe('ScannerlayoutComponent', () => {
  let component: ScannerlayoutComponent;
  let fixture: ComponentFixture<ScannerlayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScannerlayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScannerlayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
