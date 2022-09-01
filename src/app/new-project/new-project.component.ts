import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import {ProjectService} from '../project.service'
@Component({
  selector: 'app-new-project',
  templateUrl: './new-project.component.html',
  styleUrls: ['./new-project.component.scss']
})
export class NewProjectComponent implements OnInit {
  formProject = new FormGroup({
    name: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    description: new FormControl<string>('', { nonNullable: true}),
  });

  constructor(private projectService:ProjectService ,private matSnackBar: MatSnackBar, private router: Router) { }

  ngOnInit(): void {
  }

  

  submit(){
    this.projectService.projectAdd({projectName:this.formProject.controls.name.value,description:this.formProject.controls.description.value});
    localStorage.setItem('project',this.formProject.controls.name.value);
    this.router.navigate(['viewProjects']);
  }
  
  cancel(){
    this.router.navigate(['viewProjects']);
  }

}
