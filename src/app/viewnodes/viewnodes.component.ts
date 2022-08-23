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
@Component({
  selector: 'app-viewnodes',
  templateUrl: './viewnodes.component.html',
  styleUrls: ['./viewnodes.component.scss']
})
export class ViewnodesComponent implements OnInit, AfterViewInit {
  DataSource: MatTableDataSource<Node[]> = new MatTableDataSource();
  pageSize = 10;
  pageSizeOptions: number[] = [10, 25, 100];
  header = new HttpHeaders
  params: parPage = { skip: 0, limit: 10 };
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(private matSnackBar: MatSnackBar, private matDialog: MatDialog, private httpClient: HttpClient, private router: Router) { }
  ngAfterViewInit() {
    this.DataSource.paginator = this.paginator;
  }
  ngOnInit(): void {
    let options = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params: new HttpParams().append('skip', 0).append('limit', 10)
    };
    let subs$ = this.httpClient.get<Node[]>('http://localhost:3000/node/ListAll/',
      options).subscribe((listSubscribe: any) => {
        this.DataSource = new MatTableDataSource(listSubscribe);
        this.DataSource.paginator = this.paginator;
        subs$.unsubscribe();
      });
  }

  gotoAdd() {
    this.router.navigate(['/newNode']);
  }

  nodeDelete(id: string) {
    let dialogRef = this.matDialog.open(YesNoComponent, { data: { dialogHeader: 'Delete node', message: `You are sure to delete this node ` } as DialogData });
    dialogRef.afterClosed().subscribe((response) => {
      if (response === 'Ok') {
        let options = {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
          params: new HttpParams().append('id', id)
        };
        const delete$ = this.httpClient.delete<any>('http://localhost:3000/node/delete/', options).subscribe((result) => {
          if (result.status) {
            this.matSnackBar.open('Delete error', '', { duration: 3000 });
          } else {
            console.log('Result',result.name)
            this.matSnackBar.open('Deleted' ,`Node ${result.name}`,{duration:3000});
          }
          this.getNodes();
          delete$.unsubscribe();
        });
      }
    });
  }

  getNodes(){
    let options = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params: new HttpParams().append('skip', 0).append('limit', 10)
    };
    let subs$ = this.httpClient.get<Node[]>('http://localhost:3000/node/ListAll/',
      options).subscribe((listSubscribe: any) => {
        this.DataSource = new MatTableDataSource(listSubscribe);
        this.DataSource.paginator = this.paginator;
        subs$.unsubscribe();
      });
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
