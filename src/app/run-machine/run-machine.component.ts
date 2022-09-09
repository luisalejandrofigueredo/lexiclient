import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Node } from '../interfaces/node';
import { NodeService } from '../node.service';
@Component({
  selector: 'app-run-machine',
  templateUrl: './run-machine.component.html',
  styleUrls: ['./run-machine.component.scss']
})
export class RunMachineComponent implements OnInit {
  viewMachineRun = true;
  nodesTracking = ''
  machine!: string;
  nodeForm = new FormGroup({
    viewMachine: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
  });
  constructor(private nodeService: NodeService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.machine = localStorage.getItem('project')!;
  }

  click() {
    this.viewMachineRun = false;
    this.nodesTracking = 'Start'
    this.nodeForm.controls.viewMachine.setValue(this.nodesTracking, { emitEvent: true });
    this.nodeService.getOneByName(localStorage.getItem('project')!, 'Start').then((accept) => {
      console.log('accept', accept);
      this.snackBar.open('Start ', 'Message', { duration: 5000 });
    }).catch((reject) => {
      this.nodesTracking = 'Start not found';
      this.nodeForm.controls.viewMachine.setValue(this.nodesTracking, { emitEvent: true });
      this.snackBar.open('Not found fist node add node name Start', 'Error', { duration: 5000 })
    });
  }
}
