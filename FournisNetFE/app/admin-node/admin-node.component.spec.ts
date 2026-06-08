import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminNodeComponent } from './admin-node.component';

describe('AdminNodeComponent', () => {
  let component: AdminNodeComponent;
  let fixture: ComponentFixture<AdminNodeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminNodeComponent]
    });
    fixture = TestBed.createComponent(AdminNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
