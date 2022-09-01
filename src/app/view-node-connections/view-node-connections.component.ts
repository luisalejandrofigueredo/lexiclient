import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Node } from '../interfaces/node';
import { NodeService } from '../node.service'
@Component({
  selector: 'app-view-node-connections',
  templateUrl: './view-node-connections.component.html',
  styleUrls: ['./view-node-connections.component.scss']
})
export class ViewNodeConnectionsComponent implements OnInit {
  connectionForm = new FormGroup({
    name: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
  });
  viewForm = new FormGroup({
    response: new FormControl<string>('', { nonNullable: true }),
  });
  filteredNodes: string[] = [];
  options = { headers: new HttpHeaders({ 'content-type': 'application/json' }) };

  constructor(private nodeService:NodeService, private httpClient: HttpClient) { }
  ngOnInit(): void {
    let subs$ = this.nodeService.getAll(localStorage.getItem('project')!).then((listNodes: Node[]|boolean) => {
      if (typeof listNodes==='object')
         listNodes.forEach((nodeElement) => {
          this.filteredNodes.push(nodeElement.name);
        });
      }).catch((error=>{console.log('Error',error)}))
  }

  submit() {
    const getNode=this.nodeService.getOne(localStorage.getItem('project')!,this.connectionForm.controls.name.value);
    getNode.then(response=>{this.viewForm.controls.response.setValue(JSON.stringify(response, null, 2));}).catch((error)=>{console.log('error')})
  }
}
