import {Component, Inject} from '@angular/core';
import {NgForm} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogContent, MatDialogRef} from "@angular/material/dialog";
import {HttpClient} from "@angular/common/http";
import {AuthService} from "../../../core/auth.service";


export interface DialogData {
  id: string;
}

@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.scss']
})

export class ReceiptComponent {

  constructor(
    public dialogRef: MatDialogRef<ReceiptComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private http: HttpClient,
    private auth: AuthService

  ) {}

  drugs: {name: string, dosage: number, intakes: number}[] = []

  displayedColumns = ["name", "dosage", "intakes"]

  description: string


  refresh(): void {
    this.drugs = [...this.drugs];
  }


  onSave(): void {
    this.http.post('http://localhost:3000/api/doctors/receipt', {drugs: this.drugs, patient: this.data.id, doctor: this.auth.getUserId(), description: this.description}, {responseType: "blob"}).subscribe()
    this.dialogRef.close();
  }
  onAdd(form: NgForm){
    this.drugs.push({name: form.value.name, dosage: form.value.dosage, intakes: form.value.intakes})
    form.reset()
    this.refresh()
  }

}
