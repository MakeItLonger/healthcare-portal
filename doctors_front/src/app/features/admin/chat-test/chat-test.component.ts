import {Component, OnDestroy, OnInit} from '@angular/core';
import {io} from "socket.io-client";
import {AuthService} from "../../../core/auth.service";
import {Subscription} from "rxjs";
import {NavigationEnd, Router} from "@angular/router";

@Component({
  selector: 'app-chat-test',
  templateUrl: './chat-test.component.html',
  styleUrls: ['./chat-test.component.scss']
})
export class ChatTestComponent implements OnInit, OnDestroy{
  socket = io('ws://localhost:3030');

  subscription: Subscription
  routed = false;
  events$!: Subscription;

  constructor(private auth: AuthService, private router: Router) {}

  roomId = ''
  conversations: { chatId: string; mate: string }[] = []

  ngOnInit(): void {
    if (this.auth.getRole() === 'doctor'){
      this.subscription = this.auth.getDoctorsChats(this.auth.getUserId()).subscribe(res => {
        this.conversations = res.chats
      })
    }else if(this.auth.getRole() === 'patient'){
      this.subscription = this.auth.getPatientChats(this.auth.getUserId()).subscribe(res => {
        this.conversations = res.chats
      })
    }
    console.log(this.conversations)
  }

  ngOnDestroy(): void {
    if (this.subscription){
      this.subscription.unsubscribe()
    }
    if (this.events$){
      this.events$.unsubscribe()
    }
  }


}
