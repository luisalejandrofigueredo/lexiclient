import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs';
import { NodeConnections } from './interfaces/node-connections';
@Injectable({
  providedIn: 'root'
})
export class NodeConnectionsService {

  constructor(private httpClient: HttpClient) { }

  deleteNodeConnections(name: string): Promise<string | boolean> {
    return new Promise((accept, reject) => {
      let options = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        params: new HttpParams().append('name', name)
      };
      const deleteConnection$ = this.httpClient.delete<any>('http://localhost:3000/connections/deleteNodeConnections/', options).pipe(take(1)).subscribe((_result) => { 
        deleteConnection$.unsubscribe();
        accept(name);
       },
        (error) => reject(false));
    });
  }

  listAll(): Promise<NodeConnections[] | boolean> {
    return new Promise((accept, reject) => {
      const options = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      };
      let subs$ = this.httpClient.get<NodeConnections[]>('http://localhost:3000/connections/listAll/',
        options).pipe(take(1)).subscribe((response: NodeConnections[]) => {
          subs$.unsubscribe();
          accept(response)
        },(error)=>{
          subs$.unsubscribe();
          reject(false)
        });
    })
  }
}
