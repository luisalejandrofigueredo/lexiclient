import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Project } from '../interfaces/project';
import { ProjectService } from "../project.service";
import { NodeService } from "../node.service";
import { NodeConnectionsService } from '../node-connections.service'
import { environment } from '../../environments/environment';
import { NodeConnections } from '../interfaces/node-connections';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Node } from "../interfaces/node";

@Component({
  selector: 'app-copy-project',
  templateUrl: './copy-project.component.html',
  styleUrls: ['./copy-project.component.scss']
})
export class CopyProjectComponent implements OnInit {
  formProject = new FormGroup({
    name: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    description: new FormControl<string>('', { nonNullable: true }),
  });
  id!: string;
  oldName!: string;
  url = `${environment.url}/connections/add`;
  constructor(private httpClient: HttpClient, private nodeConnectionService: NodeConnectionsService, private nodeService: NodeService, private matSnackBar: MatSnackBar, private projectService: ProjectService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.id = params['id'];
      this.projectService.getOne(this.id).then((resolve) => {
        if (typeof resolve !== 'boolean') {
          this.formProject.controls.name.setValue(resolve.projectName);
          this.formProject.controls.description.setValue(resolve.description);
          this.oldName = resolve.projectName;
        }
      });
    });
    this.formProject.controls.name.valueChanges.subscribe((value) => {
      if (this.oldName === value.trim()) {
        this.matSnackBar.open('Duplicate project name', 'Error', { duration: 3000 });
        this.formProject.controls.name.markAsPristine();
      };
    })
  }

  async submit() {
    await this.projectService.projectAdd({ projectName: this.formProject.controls.name.value, description: this.formProject.controls.description.value }).catch((_error) => { this.matSnackBar.open('In project add record ', 'Error', { duration: 3000 }); }).then(async (_node) => {
      try {
        await this.addNodes(this.oldName, this.formProject.controls.name.value);
        await this.addConnections(this.oldName, this.formProject.controls.name.value);
      } catch (error) {
        this.matSnackBar.open('Error while add nodes or connections delete the project and recopy or talk with administrator ', 'Error').afterDismissed().subscribe(() => this.router.navigate(['viewProjects']))
      }
      this.matSnackBar.open('Project copied ', 'Information', { duration: 3000 }).afterDismissed().subscribe(() => this.router.navigate(['viewProjects']));
    });
  }

  async addNodes(project: string, copyProject: string): Promise<boolean> {
    return new Promise(async (accept, reject) => {
      await this.nodeService.copyNodes(project, copyProject).then((response) => {
        accept(true)
      }).catch((error) => {
        reject(false)
      });
    })
  }

  async addConnections(project: string, copyProject: string): Promise<boolean> {
    const options = { headers: new HttpHeaders({ 'content-type': 'application/json' }) };
    let body: NodeConnections;
    return new Promise(async (accept, reject) => {
      await this.nodeConnectionService.listAllProject(project).then((resolve) => {
        if (typeof resolve !== 'boolean') {
          resolve.forEach(element => {
            body = { project: copyProject, isLanguage: element.isLanguage, name: element.name, toName: element.toName, character: element.character, isRegularExpression: element.isRegularExpression }
            let sub$ = this.httpClient.post<NodeConnections | { status: string }>(this.url, body, options).subscribe(async response => {
              console.log('response', response)
              if ((<{ status: string }>response).status !== 'duplicate node' && (<{ status: string }>response).status !== 'add connection to node failed') {
                await this.pushElementToNode((<NodeConnections>response)._id!, copyProject, (<NodeConnections>response).name)
                let snack = this.matSnackBar.open('Connection created', '', { duration: 3000 });
                sub$.unsubscribe();
              } else {
                let snack = this.matSnackBar.open('Duplicate connection', '', { duration: 3000 });
                sub$.unsubscribe();
              }
            }, error => {
              let snack = this.matSnackBar.open('Error', error, { duration: 3000 });
            });
          });
          this.router.navigate(['/viewProjects']);
        }
      }).catch((_error) => {

      });
    });
  }

  async pushElementToNode(connectionId: string, project: string, name: string): Promise<boolean> {
    const url = `${environment.url}/node/getOne`;
    const options = {
      headers: new HttpHeaders({ 'content-type': 'application/json' }),
      params: new HttpParams().append('name', encodeURI(name)).append('project', project)
    };
    return new Promise<boolean>((resolve, reject) => {
      try {
        let sub$ = this.httpClient.get<Node>(url, options).subscribe(resNode => {
          const optionsConnection = {
            headers: new HttpHeaders({ 'content-type': 'application/json' }),
            params: new HttpParams().append('idNodeConnection', encodeURI(connectionId !== undefined ? connectionId : ''))
              .append('idNode', encodeURI(resNode._id !== undefined ? resNode._id : '0')).append('project', localStorage.getItem('project')!)
          };
          let subPost$ = this.httpClient.post<any>(`${environment.url}/node/addConnection/`, '', optionsConnection).subscribe((response) => {
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

  cancel() {
    this.router.navigate(['viewProjects']);
  }

}
