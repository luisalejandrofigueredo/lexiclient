import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Node } from '../interfaces/node';
import { parPage } from '../interfaces/parpage';
import { YesNoComponent } from '../yes-no/yes-no.component';
import { DialogData } from '../yes-no/dialog-data';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NodeService } from '../node.service'
import {NodeConnectionsService} from '../node-connections.service'
@Component({
  selector: 'app-viewnodes',
  templateUrl: './viewnodes.component.html',
  styleUrls: ['./viewnodes.component.scss']
})
export class ViewnodesComponent implements OnInit, AfterViewInit {
  DataSource: MatTableDataSource<Node> = new MatTableDataSource();
  pageSize = 10;
  pageSizeOptions: number[] = [10, 25, 100];
  header = new HttpHeaders
  params: parPage = { skip: 0, limit: 10 };
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(private nodeConnectionService:NodeConnectionsService,private nodeService: NodeService, private matSnackBar: MatSnackBar, private matDialog: MatDialog, private httpClient: HttpClient, private router: Router) { }
  ngAfterViewInit() {
    this.DataSource.paginator = this.paginator;
  }
  ngOnInit(): void {
    this.getNodes();
  }

  gotoAdd(): void {
    this.router.navigate(['/newNode']);
  }

  nodeDelete(id: string,name:string) {
    let dialogRef = this.matDialog.open(YesNoComponent, { data: { dialogHeader: 'Delete node', message: `You are sure to delete this node ` } as DialogData });
    dialogRef.afterClosed().subscribe((response) => {
      if (response === 'Ok') {
        const promNodeDelete = this.nodeService.nodeDelete(id);
        const promNodeConnections= this.nodeConnectionService.deleteNodeConnections(name);
        Promise.all([promNodeDelete,promNodeConnections]).then((deleteActions) => {
          if (typeof deleteActions[0] !== 'boolean') {
            this.matSnackBar.open('Deleted', `Node ${deleteActions[0]}`, { duration: 3000 });
          }
          else {
            this.matSnackBar.open('Delete error in node', '', { duration: 3000 });
          }
          if (typeof deleteActions[1] !== 'boolean') {
            this.matSnackBar.open('Deleted', `Node connections${deleteActions[0]}`, { duration: 3000 });
          }
          else {
            this.matSnackBar.open('Delete error in node', '', { duration: 3000 });
          }
        }).catch((error) => { console.log('Error in Promise all')});
        this.getNodes();
      }
    });
  }

  getNodes() {
    this.nodeService.getAll().then(list => {
      this.DataSource.paginator = this.paginator;
      if (typeof list === 'object' && typeof list !== 'undefined') {
        this.DataSource = new MatTableDataSource(list);
      }
    }).catch((error) => { console.log('Error') })
  }

  nodeEdit(name: string) {
    this.router.navigate(['/nodeEdit', name]);
  }

  pageEvent(event: PageEvent) {
    const options = {
      params: new HttpParams().append('skip', event.pageIndex * event.pageSize).append('limit', event.pageSize)
    };
    let subs$ = this.httpClient.get<Node[]>('http://localhost:3000/node/ListAll/',
      options).subscribe((listSubscribe: any) => {
        this.DataSource = new MatTableDataSource(listSubscribe);
        this.DataSource.paginator = this.paginator;
        subs$.unsubscribe();
      });
  }



}
