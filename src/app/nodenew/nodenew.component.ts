import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
@Component({
  selector: 'app-nodenew',
  templateUrl: './nodenew.component.html',
  styleUrls: ['./nodenew.component.scss']
})
export class NodenewComponent implements OnInit {
  node = new FormGroup({
    name: new FormControl<String>('', {nonNullable:true,validators:Validators.required}),
    final: new FormControl<boolean>(false,{nonNullable:true})
  });
  url = 'http://localhost:3000/node/add';
  options = { headers: new HttpHeaders({ 'content-type': 'application/json' }) };
  constructor(private httpClient: HttpClient, private matSnackBar: MatSnackBar,private router:Router) { }

  ngOnInit(): void {

  }

  submit() {
    const url = 'http://localhost:3000/node/add';
    let body = { name: this.node.controls.name.value,final:this.node.controls.final.value===true? 'true': 'false' };
    this.httpClient.post<any>(url, body, this.options).subscribe(response => {
      console.log('Console:',response);
      if (response.status !== 'duplicate node') {
        let snack = this.matSnackBar.open('Node created', '', { duration: 3000 });
      } else {
        let snack = this.matSnackBar.open('Duplicate node', '', { duration: 3000 });
      }
      this.router.navigate(['/viewNodes']);
    }, error => 
    { 
      let snack = this.matSnackBar.open('Error', error, { duration: 3000 });
      this.router.navigate(['/viewNodes']);
    });
  }

  cancel(){
    this.router.navigate(['/viewNodes']);
  }
}
