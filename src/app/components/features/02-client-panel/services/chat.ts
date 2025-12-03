import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ChatMessageDTO } from '../../../core/models/chat.dto';
import {AuthService} from '../../../core/services/auth';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private API_URL = 'http://localhost:8080/upc/MenteActiva/Chats';

  constructor(private http: HttpClient,
  private authService: AuthService) { }

  getChatHistory(): Observable<ChatMessageDTO[]> {
    const clientId = this.authService.getUserId();

    return this.http.get<ChatMessageDTO[]>(`${this.API_URL}/historial/cliente/${clientId}`);
  }
}
