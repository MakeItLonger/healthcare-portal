import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import { io } from 'socket.io-client';
import {AuthService} from "../../core/auth.service";
import {Subject, Subscription} from "rxjs";
import {ChatService} from "../../core/services/chat.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit, OnDestroy {
  roomId: string = '';
  socket = io('ws://localhost:3030');
  messages: any[] = [];
  role: string = this.auth.getRole()
  appointmentOpen = false;
  //Need to fetch about five to ten dates that are available
  availableDates: any[] = [];
  chatSub: Subscription
  routeSub: Subscription;
  mate: any

  mateSub: Subscription

  mateId = ''
  userId = ''

  constructor(private auth: AuthService, private chatService: ChatService, private router: ActivatedRoute) {
  }

  ngOnInit() {
    this.routeSub = this.router.params.subscribe(x => {
      this.roomId = x['id']
    })
    console.log(this.roomId)
    this.userId = this.auth.getUserId()
    this.chatSub =  this.chatService.getChat(this.roomId).subscribe(res => {
      this.messages = res.messages
      if (this.role === "doctor"){
        this.mateId = res.patient
        this.mateSub = this.auth.getPatientsData(this.mateId).subscribe(res => {
          this.mate = res
        })
      }else{
        this.mateId = res.doctor
        this.mateSub = this.auth.getData(this.mateId).subscribe(res => {
          this.mate = res
        })
      }
    })
    this.socket.emit('joinRoom', this.roomId);
    this.socket.on('message', (res : {sender: string, msg: string}) => {
      this.messages.push(res);
    });
  }

  sendText(textInput: HTMLTextAreaElement) {
    this.socket.emit('message', {chatId: this.roomId, id: this.auth.getUserId(), msg: textInput.value});
    textInput.value = '';
  }

  toggleAppointment() {
    this.appointmentOpen = !this.appointmentOpen;
  }

  ngOnDestroy(): void {
    this.mateSub.unsubscribe()
    this.routeSub.unsubscribe()
    this.chatSub.unsubscribe()
  }
}
