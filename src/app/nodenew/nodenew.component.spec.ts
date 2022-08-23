import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NodenewComponent } from './nodenew.component';

describe('NodenewComponent', () => {
  let component: NodenewComponent;
  let fixture: ComponentFixture<NodenewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NodenewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NodenewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
