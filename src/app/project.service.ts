import { HttpClient, HttpHeaders } from '@angular/common/http';
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
}
