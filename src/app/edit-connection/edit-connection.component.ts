import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Node } from '../interfaces/node';
import { NodeConnections } from '../interfaces/node-connections';
import { environment } from "../../environments/environment";

@Component({
  selector: 'app-edit-connection',
  templateUrl: './edit-connection.component.html',
  styleUrls: ['./edit-connection.component.scss']
})
export class EditConnectionComponent implements OnInit {
  connectionForm = new FormGroup({
    name: new FormControl<String>('',{nonNullable:true,validators:Validators.required}),
    toName: new FormControl<String>('',{nonNullable:true,validators:Validators.required}),
    character: new FormControl<String>('', {nonNullable:true,validators:Validators.required}),
    visible: new FormControl<Boolean>(false, {nonNullable:true,validators:Validators.required}),
    isRegularExpression: new FormControl<Boolean>(false, {nonNullable:true,validators:Validators.required}),
  });
  nodeConnection!: NodeConnections;
  filteredNodes: string[] = [];
  url = `${environment.url}/connections/edit`;
  id!: string;
  options = { headers: new HttpHeaders({ 'content-type': 'application/json' }) };
  constructor(private route: ActivatedRoute, private httpClient: HttpClient, private router: Router, private matSnackBar: MatSnackBar) { }
  ngOnInit(): void {
    let options = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    this.route.params.subscribe((params) => {
      let optionsConnections = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        params: new HttpParams().append('id', encodeURI(String(params['id'])))
      }
      this.id = params['id'];
      let subs$ = this.httpClient.get<NodeConnections>(`${environment.url}/connections/getOne/`, optionsConnections).subscribe((retNodeConnection: NodeConnections) => {
        this.nodeConnection = retNodeConnection;
        this.connectionForm.controls.name.setValue(retNodeConnection.name);
        this.connectionForm.controls.toName.setValue(retNodeConnection.toName);
        this.connectionForm.controls.character.setValue(retNodeConnection.character);
        this.connectionForm.controls.isRegularExpression.setValue(retNodeConnection.isRegularExpression);
        this.connectionForm.controls.visible.setValue(retNodeConnection.isVisible);
        subs$.unsubscribe();
        this.getNodes();
      }, (error) => { console.error('Error', error) });
    });;
  }

  getNodes() {
    let options = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    let subs$ = this.httpClient.get<Node[]>(`${environment.url}/node/ListAll/`,
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
    let body = {
      id: this.id, name: this.connectionForm.controls.name.value,
      toName: this.connectionForm.controls.toName.value,
      character: this.connectionForm.controls.character.value,
      isRegularExpression: this.connectionForm.controls.isRegularExpression.value,
      visible:this.connectionForm.controls.visible.value,
    }
    this.httpClient.put<any>(this.url, body, this.options).subscribe(response => {
      if (response.status !== 'Duplicate connection') {
        let snack = this.matSnackBar.open('Connection modified', '', { duration: 3000 });
      } else {
        let snack = this.matSnackBar.open('Duplicate connection', '', { duration: 3000 });
      }
      this.router.navigate(['/viewConnections']);
    }, error => {
      let snack = this.matSnackBar.open('Error', error, { duration: 3000 });
      this.router.navigate(['/viewConnections']);
    });
  }
}
