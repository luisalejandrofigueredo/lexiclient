import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Node } from '../interfaces/node';
import { NodeConnections } from '../interfaces/node-connections';
import { MatDialog } from '@angular/material/dialog';
import { YesNoComponent } from '../yes-no/yes-no.component';
import { DialogData } from '../yes-no/dialog-data'
@Component({
  selector: 'app-delete-all-nodes',
  templateUrl: './delete-all-nodes.component.html',
  styleUrls: ['./delete-all-nodes.component.scss']
})
export class DeleteAllNodesComponent implements OnInit {

  constructor(private httpClient: HttpClient, private route: Router, public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  deleteAll(): void {
    let delete$ = this.httpClient.delete<Node[]>('http://localhost:3000/node/deleteAll').subscribe((deleteSubscribe: any) => {
      let dialogRef = this.dialog.open(YesNoComponent, {
        data: {
          dialogHeader: 'Confirm deletion',
          message: 'You want delete all relations too'
        } as DialogData
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result === 'Ok') {
          let deleteConnections$ = this.httpClient.delete<NodeConnections>('http://localhost:3000/connections/deleteAll').subscribe((_nodeConnections) => {
            deleteConnections$.unsubscribe();
          });
        }
      });
      delete$.unsubscribe()
    });
  }

  cancel() {
    this.route.navigate(['/']);
  }

}
