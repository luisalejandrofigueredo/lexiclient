import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs';
import { NodeConnections } from './interfaces/node-connections';
import { environment } from '../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class NodeConnectionsService {

  constructor(private httpClient: HttpClient) { }
  deleteNodeConnections(project:string,name: string): Promise<string | boolean> {
    return new Promise((accept, reject) => {
      let options = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        params: new HttpParams().append('name', name).append('project',encodeURI(project))
      };
      const deleteConnection$ = this.httpClient.delete<any>(`${environment.url}/connections/deleteNodeConnections/`, options).pipe(take(1)).subscribe((_result) => {
        deleteConnection$.unsubscribe();
        accept(name);
      },
        (error) => reject(false));
    });
  }

  updateConnectionName(name: string,newName:string): Promise<boolean> {
    return new Promise((accept, reject) => {
      const options = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        params: new HttpParams().append('project',encodeURI(localStorage.getItem('project')!))
      };
      let sub$ = this.httpClient.put<{ status: string }>(`${environment.url}/connections/editName`, { name: name,newName:newName }).subscribe(response => {
        console.log('response status',response.status)
        if (response.status === 'OK') {
          accept(true);
        }
        else {
          reject(false);
        }
      }, (error) => {
        reject(false);
      });
    });
  }
  listAllConnectionsNode(name:string): Promise<NodeConnections[] | boolean> {
    return new Promise((accept, reject) => {
      const options = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        params: new HttpParams().append('project',encodeURI(localStorage.getItem('project')!))
        .append('name',name)
      };
      let subs$ = this.httpClient.get<NodeConnections[]>(`${environment.url}/connections/listAllConnectionsNode/`,
        options).pipe(take(1)).subscribe((response: NodeConnections[]) => {
          subs$.unsubscribe();
          accept(response)
        }, (error) => {
          subs$.unsubscribe();
          reject(false)
        });
    })
  }
  listAll(): Promise<NodeConnections[] | boolean> {
    return new Promise((accept, reject) => {
      const options = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        params: new HttpParams().append('project',encodeURI(localStorage.getItem('project')!))
      };
      let subs$ = this.httpClient.get<NodeConnections[]>(`${environment.url}/connections/listAll/`,
        options).pipe(take(1)).subscribe((response: NodeConnections[]) => {
          subs$.unsubscribe();
          accept(response)
        }, (error) => {
          subs$.unsubscribe();
          reject(false)
        });
    })
  }

  listAllProject(project:string): Promise<NodeConnections[] | boolean> {
    return new Promise((accept, reject) => {
      const options = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        params: new HttpParams().append('project',encodeURI(project))
      };
      let subs$ = this.httpClient.get<NodeConnections[]>(`${environment.url}/connections/listAll/`,
        options).pipe(take(1)).subscribe((response: NodeConnections[]) => {
          subs$.unsubscribe();
          accept(response)
        }, (error) => {
          subs$.unsubscribe();
          reject(false)
        });
    })
  }
}
