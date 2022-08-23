import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Route, Router } from '@angular/router';
import {NodeConnections} from '../interfaces/node-connections';
@Component({
  selector: 'app-delete-all-connections',
  templateUrl: './delete-all-connections.component.html',
  styleUrls: ['./delete-all-connections.component.scss']
})
export class DeleteAllConnectionsComponent implements OnInit {

  constructor(private httpClient:HttpClient,private router:Router,public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  deleteAll(): void {
    let delete$=this.httpClient.delete<NodeConnections[]>('http://localhost:3000/connections/deleteAll').subscribe((deleteSubscribe:any)=>{delete$.unsubscribe()} )
  }

  cancel(){
    this.router.navigate(['/']);
  }

}
