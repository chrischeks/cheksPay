import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageLimitsComponent } from './manage-limits.component';

describe('ManageLimitsComponent', () => {
  let component: ManageLimitsComponent;
  let fixture: ComponentFixture<ManageLimitsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageLimitsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageLimitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
