import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LexigraphComponent } from './lexigraph.component';

describe('LexigraphComponent', () => {
  let component: LexigraphComponent;
  let fixture: ComponentFixture<LexigraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LexigraphComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LexigraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
