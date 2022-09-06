import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../project.service';

@Component({
  selector: 'app-project-edit',
  templateUrl: './project-edit.component.html',
  styleUrls: ['./project-edit.component.scss']
})
export class ProjectEditComponent implements OnInit {
  _id!: string;
  oldProject!: string;
  formProject = new FormGroup({
    name: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    description: new FormControl<string>('', { nonNullable: true }),
  });
  initialValues = this.formProject
  constructor(private route: ActivatedRoute, private projectService: ProjectService, private matSnackBar: MatSnackBar, private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.projectService.getOne(params['id']).then(resolve => {
        this._id = params['id'];
        if (typeof resolve !== 'boolean') {
          this.formProject.controls.name.setValue(resolve.projectName);
          this.formProject.controls.description.setValue(resolve.description);
          this.oldProject = this.formProject.controls.description.value;
        }
      });
    });
  }
  async submit() {
    await this.projectService.projectEdit({ _id: this._id, projectName: this.formProject.controls.name.value, description: this.formProject.controls.description.value }, this.oldProject).then((resolve) => { this.matSnackBar.open('Project updated', 'Update action', { duration: 3000 }); localStorage.setItem('project', this.formProject.controls.name.value) }).catch((reject) => { this.matSnackBar.open('Project not updated fail', 'Update action', { duration: 3000 }) });
    this.router.navigate(['viewProjects']);
  }


  cancel() {
    this.router.navigate(['viewProjects']);
  }
}
