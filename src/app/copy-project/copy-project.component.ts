import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Project } from '../interfaces/project';
import { ProjectService } from "../project.service";
import { NodeService } from "../node.service";
import {NodeConnectionsService} from '../node-connections.service'
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
  constructor(private nodeConnectionService:NodeConnectionsService,private nodeService: NodeService, private matSnackBar: MatSnackBar, private projectService: ProjectService, private route: ActivatedRoute, private router: Router) { }

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
    return new Promise((accept, reject) => {
      await  this.nodeConnectionService.updateConnectionName
    });
  }

  cancel() {
    this.router.navigate(['viewProjects']);
  }

}
