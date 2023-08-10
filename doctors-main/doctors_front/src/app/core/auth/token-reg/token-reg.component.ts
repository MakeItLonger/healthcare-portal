import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {AuthService} from "../../auth.service";
import {NgForm} from "@angular/forms";
import {tokenLoginService} from "../../services/tokenLogin.service";

@Component({
  selector: 'app-token-reg',
  templateUrl: './token-reg.component.html',
  styleUrls: ['./token-reg.component.scss']
})
export class TokenRegComponent implements OnInit, OnDestroy{
  isLoading = false;
  private authStatusSub!: Subscription;

  registrationAllowed = false

  regData: any

  constructor(public authService: AuthService, private pending: tokenLoginService) {}

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
  }

  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.pending.checkToken(form.value.email, form.value.password).subscribe(r =>{
      if(r.isValid){
        this.regData = r.invite
        this.registrationAllowed = true
      }else{
        alert(r.msg)
      }
    })
  }

  onRegistration(form: NgForm){
    if (form.invalid) {
      return;
    }
    this.authService.createDoctor(this.regData.email, form.value.password, this.regData.name, form.value.position)
  }

  ngOnDestroy() {
    // this.authStatusSub.unsubscribe();
  }
}
