import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, resolveForwardRef } from '@angular/core';
import { Node } from './interfaces/node';
import { take } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NodeService {
  constructor(private httpClient: HttpClient) {
  }

  getOneByName(project: string, name: string): Promise<Node | boolean> {
    return new Promise((resolve, reject) => {
      const options = {
        headers: new HttpHeaders({ 'content-type': 'application/json' }),
        params: new HttpParams().append('project', encodeURI(project)).append('name', encodeURI(name))
      };
      const url = `${environment.url}/node/getOne`;
      let sub$ = this.httpClient.get<Node>(url, options).pipe(take(1)).subscribe(response => {
        if (response.name === name) {
          sub$.unsubscribe();
          resolve(response)
        } else {
          sub$.unsubscribe();
          reject(false);
        }
      }, (error) => {
        sub$.unsubscribe();
        reject(false);
      });
    });
  }

  //Get one node by name
  getOne(project: string, name: string): Promise<Node | boolean> {
    return new Promise((resolve, reject) => {
      const options = {
        headers: new HttpHeaders({ 'content-type': 'application/json' }),
        params: new HttpParams().append('project', encodeURI(project)).append('name', encodeURI(name))
      };
      const url = `${environment.url}/node/getOne`;
      let sub$ = this.httpClient.get<Node>(url, options).pipe(take(1)).subscribe(response => {
        sub$.unsubscribe();
        resolve(response)
      }, (error) => {
        sub$.unsubscribe();
        reject(false);
      });
    });
  }
  //Get all nodes
  getAll(project: string): Promise<Node[] | boolean> {
    return new Promise((resolve, reject) => {
      const options = {
        headers: new HttpHeaders({ 'content-type': 'application/json' }),
        params: new HttpParams().append('project', encodeURI(project))
      };
      const url = `${environment.url}/node/ListAll/`;
      let sub$ = this.httpClient.get<Node[]>(url, options).pipe(take(1)).subscribe(response => {
        sub$.unsubscribe();
        resolve(response)
      }, (error) => {
        sub$.unsubscribe();
        reject(false);
      });
    });
  }

  nodeAdd(node: Node): Promise<Node | boolean> {
    return new Promise((accept, reject) => {
      const options = { headers: new HttpHeaders({ 'content-type': 'application/json' }) };
      const url = `${environment.url}/node/add`;
      console.log('node',node);
      this.httpClient.post<any>(url, node, options).pipe(take(1)).subscribe(response => {
        if (response.status !== 'duplicate node') {
          accept(response)
        } else {
          console.log('node Reponse',response);
          reject(false);
        }
      });
    });
  }

  nodeDelete(id: string): Promise<string | boolean> {
    return new Promise((resolve, reject) => {
      const options = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        params: new HttpParams().append('id', id)
      };
      const url = `${environment.url}/node/delete/`;
      const delete$ = this.httpClient.delete<any>('http://localhost:3000/node/delete/', options).pipe(take(1)).subscribe((result) => {
        if (result.status) {
          reject(false);
        } else {
          resolve(result.name);
        };
      }, (error) => { reject(false); });
    });
  }
  //Delete one connection and array of connections in Node
  deleteOneConnection(nodeId: string, connectionId: string): Promise<boolean> {
    const options = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params: new HttpParams().append('_idNode', encodeURI(nodeId))
        .append("_idNodeConnection", encodeURI(connectionId))
    };
    return new Promise((accept, reject) => {
      const subDelete$ = this.httpClient.delete(`${environment.url}/node/deleteOneConnection`, options).subscribe((_response) => {
        subDelete$.unsubscribe();
        accept(true);
      }, (error) => {
        subDelete$.unsubscribe();
        reject(false);
      });
    });
  }

  nodeEdit(node: Node): Promise<boolean> {
    return new Promise((accept, reject) => {
      const options = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      };
      let subs$ = this.httpClient.put<any>(`${environment.url}/node/edit/`, node, options).subscribe((response) => {
        if (response.status !== 'duplicate node') {
          subs$.unsubscribe();
          accept(true);
        } else {
          subs$.unsubscribe();
          reject(false);
        }
      }, (error) => { subs$.unsubscribe(); console.error('Error', error) });
    });
  }

  copyNodes(project: string, copyProject: string): Promise<Node[] | boolean> {
    return new Promise((accept, reject) => {
      const options = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        params: new HttpParams().append('project', encodeURI(project))
      };
      let subs$ = this.httpClient.get<Node[]>(`${environment.url}/node/getNodesProject`,
        options).subscribe(async (response: Node[]) => {
          console.log(`${environment.url}/nodes/getNodesProject`, response)
          console.log('Copy project',copyProject)
          await this.addNodes(copyProject, response);
          subs$.unsubscribe();
          accept(response)
        }, (error) => {
          subs$.unsubscribe();
          reject(false)
        });
    });
  }

  addNodes(project: string, nodes: Node[]): Promise<boolean> {
    return new Promise((accept, reject) => {
      try {
        nodes.forEach(async element => {
          console.log('adding element:&s , project', element,project)
          await this.nodeAdd({ project: project, name: element.name, final: element.final }).then((response) => {
            console.log('add response', response)
          }).catch((error=>{console.log('add response', error),reject(false)}));
        })
        accept(true);
      } catch (error) {
        reject(false);
      }
    })
  }
}
