import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { parPage } from '../interfaces/parpage';
import { ProjectService } from '../project.service';
import { Project } from '../interfaces/project'
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-view-projects',
  templateUrl: './view-projects.component.html',
  styleUrls: ['./view-projects.component.scss']
})
export class ViewProjectsComponent implements OnInit {
  DataSource: MatTableDataSource<Project> = new MatTableDataSource();
  pageSize = 10;
  pageSizeOptions: number[] = [10, 25, 100];
  header = new HttpHeaders
  params: parPage = { skip: 0, limit: 10 };
  currentProject!:string|null;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(private matSnackBar:MatSnackBar,private projectService: ProjectService, private router: Router) { }

  ngOnInit(): void {
    this.currentProject=(localStorage.getItem('project')!==null)? localStorage.getItem('project'):'';
    this.getData();
  }
  async getData() {
    await this.projectService.getAll().then(resolve => {
      this.DataSource = new MatTableDataSource(resolve);
    }).catch(reject => {
      console.log('Reject No data');
    });
  }
  add() { this.router.navigate(['/newProject']) }
  projectEdit(id: string) {
    this.router.navigate(['/projectEdit',id]);
    this.getData();
   }
  selectProject(projectName: string) { 
    localStorage.setItem('project',projectName);
    this.currentProject=localStorage.getItem('project');
    this.matSnackBar.open(`Project selected ${projectName}`,'Select',{duration:5000})
  }
  cancel() { 
    this.router.navigate(['/']); 
  }
}