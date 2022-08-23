import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteAllConnectionsComponent } from './delete-all-connections.component';

describe('DeleteAllConnectionsComponent', () => {
  let component: DeleteAllConnectionsComponent;
  let fixture: ComponentFixture<DeleteAllConnectionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteAllConnectionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteAllConnectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
