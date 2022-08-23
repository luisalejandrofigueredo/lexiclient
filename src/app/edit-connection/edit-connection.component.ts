import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Node } from '../interfaces/node';
import {NodeConnections} from '../interfaces/node-connections';

@Component({
  selector: 'app-edit-connection',
  templateUrl: './edit-connection.component.html',
  styleUrls: ['./edit-connection.component.scss']
})
export class EditConnectionComponent implements OnInit {
  connectionForm = new FormGroup({
    name: new FormControl<String>('', Validators.required),
    toName: new FormControl<String>('', Validators.required),
    character: new FormControl<String>('', Validators.required),
    isRegularExpression:new FormControl<Boolean>(false, Validators.required),
  });
  nodeConnection!:NodeConnections;
  filteredNodes: string[] = [];
  url = 'http://localhost:3000/connections/edit';
  id!:string;
  options = { headers: new HttpHeaders({ 'content-type': 'application/json' })};
  constructor(private route:ActivatedRoute,private httpClient: HttpClient,private  router: Router,private matSnackBar:MatSnackBar) { }
  ngOnInit(): void {
    let options = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    this.route.params.subscribe((params) => {
      let optionsConnections={
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        params: new HttpParams().append('id', encodeURI(String(params['id'])))
      }
      this.id=params['id'];
      let subs$ = this.httpClient.get<NodeConnections>('http://localhost:3000/connections/getOne/', optionsConnections).subscribe((retNodeConnection: NodeConnections) => {
        this.nodeConnection = retNodeConnection;
        this.connectionForm.controls.name.setValue(retNodeConnection.name);
        this.connectionForm.controls.toName.setValue(retNodeConnection.toName);
        this.connectionForm.controls.character.setValue(retNodeConnection.character);
        this.connectionForm.controls.isRegularExpression.setValue(retNodeConnection.isRegularExpression);
        subs$.unsubscribe();
        this.getNodes();
      }, (error) => { console.error('Error', error) });
    });;
  }

  getNodes(){
    let options = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    let subs$ = this.httpClient.get<Node[]>('http://localhost:3000/node/ListAll/',
      options).subscribe((listSubscribe: Node[]) => {
          listSubscribe.forEach((nodeElement) => {
          this.filteredNodes.push(nodeElement.name);
        });
        subs$.unsubscribe();
      });
  }

  cancel() {
    let snack = this.matSnackBar.open('Action canceled', '', { duration: 3000 });
    this.router.navigate(['/viewConnections']);
  }

  submit() {
    let body = {id:this.id, name: this.connectionForm.controls.name.value,toName:this.connectionForm.controls.toName.value,character:this.connectionForm.controls.character.value,isRegularExpression:this.connectionForm.controls.isRegularExpression.value };
    this.httpClient.put<any>(this.url, body, this.options).subscribe(response => {
      if (response.status !== 'Duplicate connection') {
        let snack = this.matSnackBar.open('Connection modified', '', { duration: 3000 });
      } else {
        let snack = this.matSnackBar.open('Duplicate connection', '', { duration: 3000 });
      }
      this.router.navigate(['/viewConnections']);
    }, error => 
    { 
      let snack = this.matSnackBar.open('Error', error, { duration: 3000 });
      this.router.navigate(['/viewConnections']);
    });
  }
}
