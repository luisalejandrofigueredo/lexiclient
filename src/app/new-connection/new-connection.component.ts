import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Node } from '../interfaces/node';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ViewLanguageComponent } from '../view-language/view-language.component'
import { NodeConnections } from '../interfaces/node-connections';
import { NodeConnectionsService } from '../node-connections.service';
import { NodeService } from '../node.service';
import { visitAll } from '@angular/compiler';
@Component({
  selector: 'app-new-connection',
  templateUrl: './new-connection.component.html',
  styleUrls: ['./new-connection.component.scss']
})
export class NewConnectionComponent implements OnInit {
  connectionForm = new FormGroup({
    name: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    toName: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    visible: new FormControl<boolean>(true, { nonNullable: true, validators: Validators.required }),
    character: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    isRegularExpression: new FormControl<boolean>(false, { nonNullable: true, validators: Validators.required }),
    isLanguage: new FormControl<boolean>(false, { nonNullable: true, validators: Validators.required })
  });
  filteredNodes: string[] = [];
  url = 'http://localhost:3000/connections/add';
  options = { headers: new HttpHeaders({ 'content-type': 'application/json' }) };
  action!: string;
  id!: string;
  oldName!: string;
  constructor(private nodeService: NodeService, private nodeConnectionService: NodeConnectionsService, private activatedRoute: ActivatedRoute, public dialog: MatDialog, private httpClient: HttpClient, private router: Router, private matSnackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.action = params['action'];
      this.id = params['id'];
      console.log('Action:', this.action);
      if (params['action'] === 'edit') {
        const options = {
          headers: new HttpHeaders({ 'content-type': 'application/json' }),
          params: new HttpParams().append('id', encodeURI(this.id)).append('project', encodeURI(localStorage.getItem('project')!))
        };
        this.connectionForm.controls.name.disable();
        let subs$ = this.httpClient.get<any>('http://localhost:3000/connections/getOne', options).subscribe((nodeConnection) => {
          console.log('nodeConnection', nodeConnection)
          if (!nodeConnection.status) {
            this.oldName = nodeConnection.name;
            this.connectionForm.setValue({
              name: nodeConnection.name,
              toName: nodeConnection.toName,
              character: nodeConnection.character,
              isLanguage: nodeConnection.isLanguage,
              isRegularExpression: nodeConnection.isRegularExpression,
              visible: nodeConnection.isVisible
            });
          } else {
            console.log('Node Connection', nodeConnection.status)
          }
          subs$.unsubscribe();
        }, (error) => { });
      }
    });
    this.nodeService.getAll(localStorage.getItem('project')!).then((response) => {
      typeof response !== 'boolean' ? response.forEach((nodeElement) => {
        this.filteredNodes.push(nodeElement.name);
      }) : [] as NodeConnections[]
    }).catch((reject) => { });
  }

  addLanguage() {
    const dialogRef = this.dialog.open(ViewLanguageComponent);
    dialogRef.afterClosed().subscribe((retLanguage) => {
      if (retLanguage) {
        this.connectionForm.controls.character.setValue(retLanguage.name);
        this.connectionForm.controls.isRegularExpression.setValue(retLanguage.isRegularExpression);
        this.connectionForm.controls.character.markAsDirty();
      }
    });
  }

  disableCharacter() {
    if (this.connectionForm.controls.isLanguage.value) {
      this.connectionForm.controls.character.disable();
    }
    else {
      this.connectionForm.controls.character.enable();
    }
  }

  cancel() {
    let snack = this.matSnackBar.open('Action canceled', '', { duration: 3000 });
    this.router.navigate(['/viewConnections']);
  }

  async submit() {
    if (this.action === 'edit') {
      const options = { headers: new HttpHeaders({ 'content-type': 'application/json' }) };
      let body: NodeConnections = {
        _id: this.id,
        project: localStorage.getItem('project')!,
        isLanguage: this.connectionForm.controls.isLanguage.value,
        name: this.connectionForm.controls.name.value,
        toName: this.connectionForm.controls.toName.value,
        character: this.connectionForm.controls.character.value,
        isRegularExpression: this.connectionForm.controls.isRegularExpression.value,
        isVisible: this.connectionForm.controls.visible.value
      };
      this.httpClient.put<any>('http://localhost:3000/connections/edit', body, options).subscribe(response => {
        if (response.status !== 'duplicate node') {
          let snack = this.matSnackBar.open('Connection modified', '', { duration: 3000 });
        } else {
          let snack = this.matSnackBar.open('Duplicate connection', '', { duration: 3000 });
        }
        if (this.oldName !== this.connectionForm.controls.name.value) {

        }
        this.router.navigate(['/viewConnections']);
      }, error => {
        let snack = this.matSnackBar.open('Error', error, { duration: 3000 });
        this.router.navigate(['/viewConnections']);
      });
    }
    else {
      let body: NodeConnections = {
        project: localStorage.getItem('project')!,
        isLanguage: this.connectionForm.controls.isLanguage.value,
        name: this.connectionForm.controls.name.value,
        toName: this.connectionForm.controls.toName.value,
        character: this.connectionForm.controls.character.value,
        isRegularExpression: this.connectionForm.controls.isRegularExpression.value, isVisible: this.connectionForm.controls.visible.value
      };
      let sub$ = this.httpClient.post<any>(this.url, body, this.options).subscribe(async response => {
        console.log('response', response)
        if (response.status !== 'duplicate node' && response.status !== 'add connection to node failed') {
          await this.pushElementToNode(response._id)
          let snack = this.matSnackBar.open('Connection created', '', { duration: 3000 });
          this.router.navigate(['/viewConnections']);
        } else {
          let snack = this.matSnackBar.open('Duplicate connection', '', { duration: 3000 });
        }
        this.router.navigate(['/viewConnections']);
      }, error => {
        this.router.navigate(['/viewConnections']);
        let snack = this.matSnackBar.open('Error', error, { duration: 3000 });
      });
    }
  }

  async pushElementToNode(connectionId: string): Promise<boolean> {
    const options = {
      headers: new HttpHeaders({ 'content-type': 'application/json' }),
      params: new HttpParams().append('name', encodeURI(this.connectionForm.controls.name.value)).append('project', localStorage.getItem('project')!)
    };
    const url = 'http://localhost:3000/node/getOne';
    return new Promise<boolean>((resolve, reject) => {
      try {
        let sub$ = this.httpClient.get<Node>(url, options).subscribe(resNode => {
          const optionsConnection = {
            headers: new HttpHeaders({ 'content-type': 'application/json' }),
            params: new HttpParams().append('idNodeConnection', encodeURI(connectionId !== undefined ? connectionId : ''))
              .append('idNode', encodeURI(resNode._id !== undefined ? resNode._id : '0')).append('project', localStorage.getItem('project')!)
          };
          let subPost$ = this.httpClient.post<any>('http://localhost:3000/node/addConnection/', '', optionsConnection).subscribe((response) => {
            if (response === null || 'status' in response) {
              this.matSnackBar.open('Connection failed', '', { duration: 3000 });
            }
            subPost$.unsubscribe();
          });
          sub$.unsubscribe();
          resolve(true);
        }, (error) => { console.error('Error', error); reject(false) });
      } catch (error) {

      }
    });
  }
}