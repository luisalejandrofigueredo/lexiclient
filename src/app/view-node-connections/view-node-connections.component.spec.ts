import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewNodeConnectionsComponent } from './view-node-connections.component';

describe('ViewNodeConnectionsComponent', () => {
  let component: ViewNodeConnectionsComponent;
  let fixture: ComponentFixture<ViewNodeConnectionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewNodeConnectionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewNodeConnectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
