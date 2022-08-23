import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { parPage } from '../interfaces/parpage';
import { NodeConnections } from '../interfaces/node-connections';
import { Router } from '@angular/router';
import { YesNoComponent } from '../yes-no/yes-no.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogData } from '../yes-no/dialog-data';
import {Node} from '../interfaces/node'

@Component({
  selector: 'app-view-connections',
  templateUrl: './view-connections.component.html',
  styleUrls: ['./view-connections.component.scss']
})
export class ViewConnectionsComponent implements OnInit {
  constructor(private dialog:MatDialog,private httpCLient: HttpClient, private matSnackBar: MatSnackBar,private router:Router) { }
  DataSource: MatTableDataSource<NodeConnections[]> = new MatTableDataSource();
  pageSize = 10;
  pageSizeOptions: number[] = [10, 25, 100];
  header = new HttpHeaders
  params: parPage = { skip: 0, limit: 10 };
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngOnInit(): void {
    let options = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    let subs$ = this.httpCLient.get<NodeConnections[]>('http://localhost:3000/connections/listAll/',
      options).subscribe((listSubscribe: any) => {
        this.DataSource = new MatTableDataSource(listSubscribe);
        this.DataSource.paginator = this.paginator;
        subs$.unsubscribe();
      });
  }
  
  ngAfterViewInit() {
    this.DataSource.paginator = this.paginator;
  }

  nodeConnectionEdit(id:string){
    this.router.navigate(['/addConnection','edit',id]);
  }

  add() {
    this.router.navigate(['/addConnection','add','']);
   }

   deleteNodeConnection(id:string,nodeName:string){
    let dialogRef = this.dialog.open(YesNoComponent, {
      data: {
        dialogHeader: 'Confirm relation deletion',
        message: 'You delete this node connection'
      } as DialogData
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'Ok') {
        const options = {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
          params: new HttpParams().append('name', encodeURI(nodeName))
        };
        const sub$=this.httpCLient.get<Node>('http://localhost:3000/node/getOne',options).subscribe((node)=>{
          console.log('Node',node);
          const optionsDelete = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
            params: new HttpParams().append('_idNode', encodeURI(node._id!==undefined ? node._id:'' ))
            .append("_idNodeConnection",encodeURI(id))
          };
          const subDelete$=this.httpCLient.delete('http://localhost:3000/node/deleteOneConnection',optionsDelete).subscribe((deleted)=>{
            console.log('register deleted')
          });
          sub$.unsubscribe();
        });
      }
    });
   }
}
