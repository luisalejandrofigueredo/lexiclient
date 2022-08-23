import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Node } from '../interfaces/node';
@Component({
  selector: 'app-node-edit',
  templateUrl: './node-edit.component.html',
  styleUrls: ['./node-edit.component.scss']
})
export class NodeEditComponent implements OnInit {
  name!: string;
  node!: Node;
  nodeForm = new FormGroup({
    name: new FormControl<String>('', Validators.required),
    final: new FormControl<boolean>(false)
  });
  constructor(private matSnackBar: MatSnackBar, private httpClient: HttpClient, private route: ActivatedRoute, private router: Router) {

  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const options = {
        params: new HttpParams().append('name', encodeURI(String(params['name'])))
      };
      let subs$ = this.httpClient.get<Node>('http://localhost:3000/node/getOne/', options).subscribe((retNode: Node) => {
        this.node = retNode;
        this.nodeForm.controls.name.setValue(retNode.name);
        this.nodeForm.controls.final.setValue(retNode.final);
        subs$.unsubscribe();
      }, (error) => { console.error('Error', error) });
    })
  }

  submit() {
    const options = {
    };
    const body = {
      _id: this.node._id != null ? this.node._id : '',
      'name': this.nodeForm.controls.name.value,
      'final': this.nodeForm.controls.final.value
    };
    let subs$ = this.httpClient.put<any>('http://localhost:3000/node/edit/', body, options).subscribe((response) => {
      if (response.status !== 'duplicate node') {
        let snack = this.matSnackBar.open('Node modified', '', { duration: 3000 });
      } else {
        let snack = this.matSnackBar.open('Duplicate node', '', { duration: 3000 });
      }
      subs$.unsubscribe();
    }, (error) => { console.error('Error', error) });
    this.router.navigate(['/viewNodes']);
  }

  cancel() {
    this.router.navigate(['/viewNodes']);
  }

}
