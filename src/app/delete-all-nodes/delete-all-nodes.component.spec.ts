import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteAllNodesComponent } from './delete-all-nodes.component';

describe('DeleteAllNodesComponent', () => {
  let component: DeleteAllNodesComponent;
  let fixture: ComponentFixture<DeleteAllNodesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteAllNodesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteAllNodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
