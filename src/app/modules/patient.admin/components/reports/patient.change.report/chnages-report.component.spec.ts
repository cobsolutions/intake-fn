import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChnagesReportComponent } from './chnages-report.component';

describe('ChnagesReportComponent', () => {
  let component: ChnagesReportComponent;
  let fixture: ComponentFixture<ChnagesReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChnagesReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChnagesReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
