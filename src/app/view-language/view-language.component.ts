import { HttpClient, HttpHeaders, HttpParams, HttpParamsOptions } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { parPage } from '../interfaces/parpage';
import { Language } from '../interfaces/language';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { AddLanguageComponent } from '../add-language/add-language.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-view-language',
  templateUrl: './view-language.component.html',
  styleUrls: ['./view-language.component.scss']
})
export class ViewLanguageComponent implements OnInit {
  DataSource: MatTableDataSource<Language[]> = new MatTableDataSource();
  pageSize = 10;
  pageSizeOptions: number[] = [10, 25, 100];
  header = new HttpHeaders;
  params: parPage = { skip: 0, limit: 10 };
  options = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(private matSnackBar: MatSnackBar,private matDialog: MatDialog, private httpCLient: HttpClient, public dialogRef: MatDialogRef<ViewLanguageComponent>) { }

  ngOnInit(): void {
    let subs$ = this.httpCLient.get<Language[]>(`${environment.url}/language/listAll/`,
      this.options).subscribe((listSubscribe: any) => {
        this.DataSource = new MatTableDataSource(listSubscribe);
        this.DataSource.paginator = this.paginator;
        subs$.unsubscribe();
      });
  }

  cancel() {
    this.dialogRef.close();
  }

  add() {
    const elementRef = this.matDialog.open(AddLanguageComponent);
    elementRef.afterClosed().subscribe((result) => {
      if (result === 'Add') {
        let subs$ = this.httpCLient.get<Language[]>(`${environment.url}/language/listAll/`,
          this.options).subscribe((listSubscribe: any) => {
            this.DataSource = new MatTableDataSource(listSubscribe);
            this.DataSource.paginator = this.paginator;
            subs$.unsubscribe();
          });
      }
    });
  }

  languageEdit(id: string) {
    const options = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params: new HttpParams().append('id', encodeURI(id))
    };
    let subs$ = this.httpCLient.get<any>(`${environment.url}/language/getOne/`,
      options).subscribe((recordLanguage: any) => {
        if (!recordLanguage.status) {
          const elementRef = this.matDialog.open(AddLanguageComponent, { data: { action: 'edit', record: recordLanguage } });
          elementRef.afterClosed().subscribe(result => {
            console.log('result',result)
            if (result === 'edit') {
              let subs$ = this.httpCLient.get<Language[]>(`${environment.url}/language/listAll/`,
                this.options).subscribe((listSubscribe: any) => {
                  this.DataSource = new MatTableDataSource(listSubscribe);
                  this.DataSource.paginator = this.paginator;
                  subs$.unsubscribe();
                });
            } else {
              subs$.unsubscribe();
            }
          })
        } else {
          let snack = this.matSnackBar.open('Error', 'Not found language ', { duration: 3000 });
        }
      });
  }

  returnLanguage(name: string, isRegularExpression: boolean) {
    this.dialogRef.close({ name: name, isRegularExpression: isRegularExpression });
  }



}
