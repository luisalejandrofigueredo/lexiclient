import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Route } from '@angular/router';
import { NodeConnections } from '../interfaces/node-connections';
import { parPage } from '../interfaces/parpage';
import { NodeConnectionsService } from "../node-connections.service";
import { NodeService } from "../node.service";
import { Node } from '../interfaces/node';
import { ViewNodesDirectConnectionsInverseComponent } from "../view-nodes-direct-connections-inverse/view-nodes-direct-connections-inverse.component";

@Component({
  selector: 'app-view-nodes-direct-connections',
  templateUrl: './view-nodes-direct-connections.component.html',
  styleUrls: ['./view-nodes-direct-connections.component.scss']
})
export class ViewNodesDirectConnectionsComponent implements OnInit {
  DataSource: MatTableDataSource<NodeConnections> = new MatTableDataSource();
  DataSource2: MatTableDataSource<NodeConnections> = new MatTableDataSource();
  pageSize = 10;
  pageSizeOptions: number[] = [10, 25, 100];
  header = new HttpHeaders;
  params: parPage = { skip: 0, limit: 10 };
  project: string = ''
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(private route:ActivatedRoute,private nodeConnectionsService:NodeConnectionsService,private nodeService:NodeService) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.project = localStorage.getItem('project')!;
      this.getAll(this.project,params['id']);

    });
  }

  getAll(project:string,id:string){
    this.nodeService.getOneById(project,id).then((accept)=>{
      this.nodeConnectionsService.listAllConnectionsNode((<Node>accept).name).then((accept)=>{
        this.DataSource.data=accept as NodeConnections[];
        console.log('Accept',accept);
      })
    })
  }

  add(){}

  gotoProjects(){}

  viewRegExp(){}

  deleteNodeConnection(id:string,name:string){}

  nodeConnectionEdit(id:string){}

}
