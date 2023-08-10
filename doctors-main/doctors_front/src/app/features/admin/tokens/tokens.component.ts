import { Component } from '@angular/core';
import {tokenLoginService} from "../../../core/services/tokenLogin.service";

@Component({
  selector: 'app-tokens',
  templateUrl: './tokens.component.html',
  styleUrls: ['./tokens.component.scss']
})
export class TokensComponent {

  constructor(private token: tokenLoginService) {
  }

  onSave(email: string, name: string){
    this.token.createToken(email, name)
  }


}
