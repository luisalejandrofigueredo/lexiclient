import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Node } from '../interfaces/node';
import { Router } from '@angular/router';
import { NodeService } from '../node.service'
@Component({
  selector: 'app-nodenew',
  templateUrl: './nodenew.component.html',
  styleUrls: ['./nodenew.component.scss']
})
export class NodenewComponent implements OnInit {
  node = new FormGroup({
    name: new FormControl<String>('', { nonNullable: true, validators: Validators.required }),
    final: new FormControl<boolean>(false, { nonNullable: true })
  });

  constructor(private nodeService: NodeService, private httpClient: HttpClient, private matSnackBar: MatSnackBar, private router: Router) { }

  ngOnInit(): void {

  }

  async submit() {
    let body = { name: this.node.controls.name.value, final: this.node.controls.final.value } as Node;
    await this.nodeService.nodeAdd(body).then(response => {
      let snack = this.matSnackBar.open(`Node created Name:${typeof response !== 'boolean' ? response.name : ''}`, 'Node created', {
        duration: 3000
      });
    })
      .catch(_error => { let snack = this.matSnackBar.open('Duplicate node', '', { duration: 3000 }); });
    this.router.navigate(['/viewNodes']);
  }

  cancel() {
    this.router.navigate(['/viewNodes']);
  }
}
