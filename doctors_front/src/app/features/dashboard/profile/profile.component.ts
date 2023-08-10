import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "../../../core/auth.service";
import {Subscription} from "rxjs";
import {FormBuilder, FormGroup, NgForm} from "@angular/forms";
import {ConfirmationDialogComponent} from "../../admin/confirmation-dialog/confirmation-dialog.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy{

  user: {
    name: string
    email: string
    position?: string
    description?: string,
    avatar: {
      public_id: string,
      url: string
    }
  }

  doctor: boolean = this.auth.getRole() === "doctor"

  userSub: Subscription

  personalDataDisabled = true

  selectedAvatar: string | ArrayBuffer | null

  onFileChange(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedAvatar = e.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
    }}


  togglePersonalData(){
    this.personalDataDisabled = !this.personalDataDisabled
  }

  passwordDisabled = true

  togglePassword(){
    this.passwordDisabled = !this.passwordDisabled
  }



  constructor(private auth: AuthService,  private dialog: MatDialog,) {}

  ngOnInit(): void {
    this.userSub = this.auth.getProfileData().subscribe(result => {
      console.log(result)
      this.user = result
    })
  }

  onSave(dataForm: NgForm){
    console.log(dataForm.value)
    const updatedUser = {
      name: dataForm.value.name,
      email: dataForm.value.email,
      position: dataForm.value.position,
      description: dataForm.value.description,
      avatar: this.selectedAvatar
    }
    this.auth.saveProfileData(updatedUser)
  }

  onPasswordChange(dataForm: NgForm){
    this.auth.savePassword(dataForm.value.password)
  }

  openConfirmationDialog(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent);
    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        console.log("delete")
      }
    });
  }

  ngOnDestroy(): void {
    if(this.userSub){
      this.userSub.unsubscribe()
    }
  }

}
