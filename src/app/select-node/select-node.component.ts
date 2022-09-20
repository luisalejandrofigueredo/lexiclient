import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { parPage } from '../interfaces/parpage';
import { NodeService } from '../node.service';
@Component({
  selector: 'app-select-node',
  templateUrl: './select-node.component.html',
  styleUrls: ['./select-node.component.scss']
})
export class SelectNodeComponent implements OnInit {
  DataSource: MatTableDataSource<Node> = new MatTableDataSource();
  pageSize = 10;
  pageSizeOptions: number[] = [10, 25, 100];
  params: parPage = { skip: 0, limit: 10 };
  project!: string | null;
  constructor(public dialogRef: MatDialogRef<SelectNodeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,private nodeService:NodeService) { }

  ngOnInit(): void {
      this.nodeService.getAllHidden(localStorage.getItem('project')!).then(result=>{
        this.DataSource.data=<Node[]><unknown>result;
      }).catch((error)=>{
        console.log('Error retrieving data from nodes check the server')
      });
  }

  pageEvent(event: PageEvent) {
    this.nodeService.getAllHidden(localStorage.getItem('project')!).then(result=>{
      this.DataSource.data=<Node[]><unknown>result ;
    });
  }

  selectNode(id:string){
    this.dialogRef.close(id);
  }

  Ok() {
    this.dialogRef.close();
  }

  Cancel() {
    this.dialogRef.close();
  }
}
