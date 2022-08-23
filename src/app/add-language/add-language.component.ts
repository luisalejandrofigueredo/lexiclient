import { DataSource } from '@angular/cdk/collections';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Language } from '../interfaces/language';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-language',
  templateUrl: './add-language.component.html',
  styleUrls: ['./add-language.component.scss']
})
export class AddLanguageComponent implements OnInit {
  languageForm = new FormGroup({
    name: new FormControl<string>('', Validators.required),
    chain: new FormControl<string>('', Validators.required),
    isRegularExpression: new FormControl<boolean>(false, Validators.required),
  });
  url = 'http://localhost:3000/language/add';
  options = { headers: new HttpHeaders({ 'content-type': 'application/json' }) };
  constructor(private matSnackBar: MatSnackBar, private httpClient: HttpClient, public dialogRef: MatDialogRef<AddLanguageComponent>, @Inject(MAT_DIALOG_DATA) public data: { action: string; record: Language}) { }

  ngOnInit(): void {
    console.log('record language',this.data.record)
    if (this.data.action === 'edit') {
      this.languageForm.setValue({
        name: this.data.record.name,
        chain: this.data.record.chain,
        isRegularExpression: this.data.record.isRegularExpression
      });
    }
  }

  submit() {
    console.log('submit')
    if (this.data.action = 'edit') {
      let body = {
        _id:this.data.record._id,
        name: this.languageForm.controls.name.value,
        chain: this.languageForm.controls.chain.value,
        isRegularExpression: this.languageForm.controls.isRegularExpression.value
      };
      this.httpClient.put<any>('http://localhost:3000/language/edit', body, this.options).subscribe(response => {
        if (response.status !== 'Duplicate language') {
          let snack = this.matSnackBar.open('Language edited', '', { duration: 3000 });
        } else {
          let snack = this.matSnackBar.open('Duplicate language', '', { duration: 3000 });
        }
      }, error => {
        let snack = this.matSnackBar.open('Error', error, { duration: 3000 });
      });
      this.dialogRef.close('edit');
    } else {
      let body = {
        name: this.languageForm.controls.name.value,
        chain: this.languageForm.controls.chain.value,
        isRegularExpression: this.languageForm.controls.isRegularExpression.value
      };
      this.httpClient.post<any>(this.url, body, this.options).subscribe(response => {
        if (response.status !== 'Duplicate language') {
          let snack = this.matSnackBar.open('Language created', '', { duration: 3000 });
        } else {
          let snack = this.matSnackBar.open('Duplicate language', '', { duration: 3000 });
        }
      }, error => {
        let snack = this.matSnackBar.open('Error', error, { duration: 3000 });
      });
      this.dialogRef.close('Add');
    }
  }

  cancel() {
    this.dialogRef.close();
  }

}
