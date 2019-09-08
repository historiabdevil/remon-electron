import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchViewerComponent } from './branch-viewer.component';

describe('BranchViewerComponent', () => {
  let component: BranchViewerComponent;
  let fixture: ComponentFixture<BranchViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BranchViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
