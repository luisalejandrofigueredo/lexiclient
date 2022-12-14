import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Node } from '../interfaces/node';
import { Router } from '@angular/router';
import { NodeService } from '../node.service'
import { ThemePalette } from '@angular/material/core';
import { TmplAstRecursiveVisitor } from '@angular/compiler';

@Component({
  selector: 'app-nodenew',
  templateUrl: './nodenew.component.html',
  styleUrls: ['./nodenew.component.scss']
})
export class NodenewComponent implements OnInit {
  nodeForm = new FormGroup({
    name: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    colorCtr:new FormControl(),
    final: new FormControl<boolean>(false, { nonNullable: true })
  });
  disabled:boolean=false;
  touchUi:boolean=true;
  color:string='';
  constructor(private nodeService: NodeService, private httpClient: HttpClient, private matSnackBar: MatSnackBar, private router: Router) { }

  ngOnInit(): void {

  }

  async submit() {
    const color=this.nodeForm.controls.colorCtr.value?.hex
    let body = { project: localStorage.getItem('project'),
    name: this.nodeForm.controls.name.value,
     final: this.nodeForm.controls.final.value,
     color:color,coord:{x:100,y:100} } as Node;
    await this.nodeService.nodeAdd(body).then(response => {
      let snack = this.matSnackBar.open(`Node created Name:${typeof response !== 'boolean' ? response.name : ''}`, 'Node created', {
        duration: 3000
      });
    }).catch(_error => { let snack = this.matSnackBar.open('Duplicate node', '', { duration: 3000 }); });
    this.router.navigate(['/viewNodes']);
  }

  cancel() {
    this.router.navigate(['/viewNodes']);
  }
}
