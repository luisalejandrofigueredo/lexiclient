import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewNodesDirectConnectionsComponent } from './view-nodes-direct-connections.component';

describe('ViewNodesDirectConnectionsComponent', () => {
  let component: ViewNodesDirectConnectionsComponent;
  let fixture: ComponentFixture<ViewNodesDirectConnectionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewNodesDirectConnectionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewNodesDirectConnectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
