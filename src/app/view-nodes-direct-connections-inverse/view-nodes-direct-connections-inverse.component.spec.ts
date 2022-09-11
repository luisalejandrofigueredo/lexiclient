import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewNodesDirectConnectionsInverseComponent } from './view-nodes-direct-connections-inverse.component';

describe('ViewNodesDirectConnectionsInverseComponent', () => {
  let component: ViewNodesDirectConnectionsInverseComponent;
  let fixture: ComponentFixture<ViewNodesDirectConnectionsInverseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewNodesDirectConnectionsInverseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewNodesDirectConnectionsInverseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
