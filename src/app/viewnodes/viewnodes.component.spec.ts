import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewnodesComponent } from './viewnodes.component';

describe('ViewnodesComponent', () => {
  let component: ViewnodesComponent;
  let fixture: ComponentFixture<ViewnodesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewnodesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewnodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
