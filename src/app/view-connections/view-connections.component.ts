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
import { Node } from '../interfaces/node'
import { NodeConnectionsService } from '../node-connections.service'
import { NodeService } from '../node.service';

@Component({
  selector: 'app-view-connections',
  templateUrl: './view-connections.component.html',
  styleUrls: ['./view-connections.component.scss']
})
export class ViewConnectionsComponent implements OnInit {
  DataSource: MatTableDataSource<NodeConnections> = new MatTableDataSource();
  pageSize = 10;
  pageSizeOptions: number[] = [10, 25, 100];
  header = new HttpHeaders
  params: parPage = { skip: 0, limit: 10 };
  project:string=''
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(private nodeService: NodeService, private nodeConnectionService: NodeConnectionsService, private dialog: MatDialog, private httpCLient: HttpClient, private matSnackBar: MatSnackBar, private router: Router) { }
  ngOnInit(): void {
   this.project=localStorage.getItem('project')!;
   this.getAll();
  }

  gotoProjects(){
    this.router.navigate(['viewProjects']);
  }
  async getAll(){
    let proGetAll$ = await this.nodeConnectionService.listAll().then(response => {
      if (typeof response !== 'boolean') this.DataSource = new MatTableDataSource(response);
      this.DataSource.paginator = this.paginator;
    }).catch((error) => { });

  }

  ngAfterViewInit() {
    this.DataSource.paginator = this.paginator;
  }

  nodeConnectionEdit(id: string) {
    this.router.navigate(['/addConnection', 'edit', id]);
  }

  add() {
    this.router.navigate(['/addConnection', 'add', '']);
  }

  async deleteNodeConnection(id: string, nodeName: string) {
    let dialogRef = this.dialog.open(YesNoComponent, {
      data: {
        dialogHeader: 'Confirm relation deletion',
        message: 'You delete this node connection'
      } as DialogData
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === 'Ok') {
        await this.nodeService.getOne(localStorage.getItem('project')!,nodeName).then(async (response) => {
          if (typeof response === 'object' && typeof response !== 'undefined') {
            const idNode = response._id;
            this.callDelete(typeof idNode !== 'undefined' ? idNode : '', id);
            let proGetAll$ = await this.nodeConnectionService.listAll().then(response => {
              if (typeof response !== 'boolean') this.DataSource = new MatTableDataSource(response);
              this.DataSource.paginator = this.paginator;
            }).catch((error) => { });
          }
          else {
            console.log();
          }
          this.getAll();
        });
      }
    })
  };

  async callDelete(idNode: string, idConnection: string) {
    await this.nodeService.deleteOneConnection(idNode, idConnection)
      .then((resolve) => { 
        const matSnack=this.matSnackBar.open('Connections deleted','',{duration:3000});
      })
      .catch((reject) => { 
        const matSnack=this.matSnackBar.open('Connections deleted failed','',{duration:3000});
      });
  }

  viewRegExp() {
    window.open("https://regexr.com/", "_blank");
  }
}
