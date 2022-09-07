import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Project } from '../interfaces/project';
import { ProjectService } from "../project.service";
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
  id!:string;
  constructor(private projectService:ProjectService,private route: ActivatedRoute,private router:Router) { }

  ngOnInit(): void {
     this.route.params.subscribe((params)=>{
      this.id=params['id'];
       this.projectService.getOne(this.id).then((resolve)=>{
        if (typeof resolve !== 'boolean') {
          this.formProject.controls.name.setValue(resolve.projectName);
          this.formProject.controls.description.setValue(resolve.description);
        }
       });
     });
  }

  submit() { }

  cancel() { 
    this.router.navigate(['viewProjects']);
  }

}
