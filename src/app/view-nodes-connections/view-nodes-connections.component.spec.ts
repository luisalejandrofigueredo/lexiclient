import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewNodesConnectionsComponent } from './view-nodes-connections.component';

describe('ViewNodesConnectionsComponent', () => {
  let component: ViewNodesConnectionsComponent;
  let fixture: ComponentFixture<ViewNodesConnectionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewNodesConnectionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewNodesConnectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
