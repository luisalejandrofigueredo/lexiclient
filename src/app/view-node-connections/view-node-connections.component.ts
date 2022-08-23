import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Node } from '../interfaces/node';
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

  constructor(private httpClient: HttpClient) { }
  ngOnInit(): void {
    let subs$ = this.httpClient.get<Node[]>('http://localhost:3000/node/ListAll/',
      this.options).subscribe((listSubscribe: Node[]) => {
        listSubscribe.forEach((nodeElement) => {
          this.filteredNodes.push(nodeElement.name);
        });
        subs$.unsubscribe();
      });
  }

  submit() {
    const options = {
      headers: new HttpHeaders({ 'content-type': 'application/json' }),
      params: new HttpParams().append('name', encodeURI(String(this.connectionForm.controls.name.value)))
    };
    console.log('Name', this.connectionForm.controls.name.value);
    let subs$ = this.httpClient.get<Node>('http://localhost:3000/node/getOne',
      options).subscribe((nodeSubscribe: Node) => {
        this.viewForm.controls.response.setValue(JSON.stringify(nodeSubscribe, null, 2));
        subs$.unsubscribe();
      });

  }
}
