import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateComponentScannerComponent } from './create-component-scanner.component';

describe('CreateComponentScannerComponent', () => {
  let component: CreateComponentScannerComponent;
  let fixture: ComponentFixture<CreateComponentScannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateComponentScannerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateComponentScannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
