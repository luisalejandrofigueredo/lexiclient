import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RunMachineComponent } from './run-machine.component';

describe('RunMachineComponent', () => {
  let component: RunMachineComponent;
  let fixture: ComponentFixture<RunMachineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RunMachineComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RunMachineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
