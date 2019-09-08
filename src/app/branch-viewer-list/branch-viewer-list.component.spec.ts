import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchViewerListComponent } from './branch-viewer-list.component';

describe('BranchViewerListComponent', () => {
  let component: BranchViewerListComponent;
  let fixture: ComponentFixture<BranchViewerListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BranchViewerListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchViewerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
