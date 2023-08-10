import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {AuthService} from "../../../core/auth.service";
import {io} from "socket.io-client";
import {Subscription} from "rxjs";
import {ChatService} from "../../../core/services/chat.service";
import {Router} from "@angular/router";


@Component({
  selector: 'app-chat-block',
  templateUrl: './chat-block.component.html',
  styleUrls: ['./chat-block.component.scss']
})
export class ChatBlockComponent implements OnInit, OnDestroy{

  isAuthorised = this.auth.getIsAuth()
  socket = io('ws://localhost:3030');
  constructor(private auth: AuthService, private chatService: ChatService, private router: Router) {}

  roomId = ""
  onlineDoctors: {
    first_name: string,
    second_name: string,
    id: string,
    avatar: any,
    position:string,
    description: string
  }[] = []

  subscription: Subscription

  async selectRoom(id: string) {
    (await this.chatService.createChat(id)).subscribe(
      (response) => {
        this.roomId = response.id
        this.router.navigate(['dashboard/chat/'+ this.roomId])
      },
      (error) => {
        alert(error)
      })
  }
  ngOnInit(): void {
    this.socket.emit('getOnline')
    this.socket.on('activeDoctors', (online: string[])=> {
      this.onlineDoctors = []
      online.map( id => {
       this.subscription = this.auth.getData(id).subscribe(x => this.onlineDoctors.push(x))
        console.log(this.onlineDoctors)
      })
    })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

}
