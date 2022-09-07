import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyProjectComponent } from './copy-project.component';

describe('CopyProjectComponent', () => {
  let component: CopyProjectComponent;
  let fixture: ComponentFixture<CopyProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CopyProjectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CopyProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
