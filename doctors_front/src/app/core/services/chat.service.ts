import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {AuthService} from "../auth.service";

@Injectable()
export class ChatService {
  CHAT_URL = 'http://localhost:3000/api/chat/';

  constructor(private http: HttpClient, private auth: AuthService) {}

  getChat(id: string){
    return this.http.get<{_id: string, patient: string, doctor: string, messages: string[] }>(this.CHAT_URL + id)
  }

  async createChat(id: string) {
    return this.http.post<{ msg: string, id: string }>(this.CHAT_URL, {
      patient: this.auth.getUserId(),
      doctor: id,
    });
  }
}
