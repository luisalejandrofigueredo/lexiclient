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
  nodesTracking=''
  nodeForm = new FormGroup({
    viewMachine: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
  });
  constructor(private nodeService:NodeService,private snackBar:MatSnackBar) { }

  ngOnInit(): void {
  }

  click() {
    this.viewMachineRun = false;
    this.nodesTracking='Start'
    this.nodeForm.controls.viewMachine.setValue(this.nodesTracking,{emitEvent:true});
    this.nodeService.getOneByName(localStorage.getItem('project')!,'Start').then((accept)=>{
      this.snackBar.open('Start','Message');
    }).catch((reject)=>{ this.snackBar.open('Not found fist node add node name Start','Error')});
  }

}
