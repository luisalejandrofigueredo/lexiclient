import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs';
import {Project} from './interfaces/project'
@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private httpClient:HttpClient) { }
  projectAdd(project: Project): Promise<Node | boolean> {
    return new Promise((accept, reject) => {
      const options = { headers: new HttpHeaders({ 'content-type': 'application/json' }) };
      const url = 'http://localhost:3000/project/add';
      this.httpClient.post<any>(url, project, options).pipe(take(1)).subscribe(response => {
        if (response.status !== 'duplicate project') {
          accept(response)
        } else {
          reject(false);
        }
      });
    });
  }

  //Get One record project 
  getOne(id: string): Promise<Project | boolean> {
    return new Promise((resolve, reject) => {
      const options = {
        headers: new HttpHeaders({ 'content-type': 'application/json' }),
        params: new HttpParams().append('id', encodeURI(id))
      };
      const url = 'http://localhost:3000/project/getOne';
      let sub$ = this.httpClient.get<Project>(url, options).pipe(take(1)).subscribe(response => {
        sub$.unsubscribe();
        resolve(response)
      }, (error) => {
        sub$.unsubscribe();
        reject(false);
      });
    });
  }

  //Get all projects 
  getAll(): Promise<Project[]> {
    return new Promise((resolve, reject) => {
      const options = { headers: new HttpHeaders({ 'content-type': 'application/json' }) };
      const url = 'http://localhost:3000/project/ListAll/';
      let sub$ = this.httpClient.get<Project[]>(url, options).pipe(take(1)).subscribe(response => {
        sub$.unsubscribe();
        resolve(response)
      }, (error) => {
        sub$.unsubscribe();
        reject([] as Project[]);
      });
    });
  }

  projectEdit(project: Project): Promise<boolean> {
    return new Promise((accept, reject) => {
      const options = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      };
      let subs$ = this.httpClient.put<any>('http://localhost:3000/project/edit/', project, options).subscribe((response) => {
      if (response.status !== 'duplicate project') {
        subs$.unsubscribe();
        accept(true);
      } else {
        subs$.unsubscribe();
        reject(false);
      }
    }, (error) => { subs$.unsubscribe();console.error('Error', error) });
    });
  }

}

