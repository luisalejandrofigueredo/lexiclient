import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Node } from '../interfaces/node';
import { NodeService } from '../node.service';
import { NodeConnectionsService } from '../node-connections.service';
@Component({
  selector: 'app-node-edit',
  templateUrl: './node-edit.component.html',
  styleUrls: ['./node-edit.component.scss']
})
export class NodeEditComponent implements OnInit {
  name!: string;
  oldName!: string;
  node!: Node;
  nodeForm = new FormGroup({
    name: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    final: new FormControl<boolean>(false)
  });
  constructor(private nodeConnectionService: NodeConnectionsService, private nodeService: NodeService, private matSnackBar: MatSnackBar, private httpClient: HttpClient, private route: ActivatedRoute, private router: Router) {

  }

  async ngOnInit(): Promise<void> {
    this.route.params.subscribe((params) => {
      this.nodeService.getOne(localStorage.getItem('project')!,String(params['name'])).then(accept => {
        if (typeof accept === 'object') {
          this.node = accept;
          this.oldName = this.node.name;
          this.nodeForm.controls.name.setValue(this.node.name);
          this.nodeForm.controls.final.setValue(this.node.final);
        }
      }).catch((error) => { });
    })
  }

  async submit() {
    const options = {
    };
    const node = {
      _id: this.node._id != null ? this.node._id : '',
      'name': this.nodeForm.controls.name.value,
      'final': this.nodeForm.controls.final.value
    } as Node;
    if (this.oldName !== this.nodeForm.controls.name.value) {
      await this.nodeService.nodeEdit(node).then(async (accept) => {
        await this.nodeConnectionService.updateConnectionName(this.oldName,this.nodeForm.controls.name.value).then((accept) => {
        }).catch((error) => { });
      }).catch((error) => { });
    }
    await this.router.navigate(['/viewNodes']);
  }

  cancel() {
    this.router.navigate(['/viewNodes']);
  }

}
