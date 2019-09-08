import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchCasterComponent } from './branch-caster.component';

describe('BranchCasterComponent', () => {
  let component: BranchCasterComponent;
  let fixture: ComponentFixture<BranchCasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BranchCasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchCasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
