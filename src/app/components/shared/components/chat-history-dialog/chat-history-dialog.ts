import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../material/material.imports';

import { ChatService } from '../../../features/02-client-panel/services/chat';
import { ChatMessageDTO } from '../../../core/models/chat.dto'; // <-- 1. ASEGÚRATE DE IMPORTAR ESTO

@Component({
  selector: 'app-chat-history-dialog',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './chat-history-dialog.html',
  styleUrls: ['./chat-history-dialog.css']
})
export class ChatHistoryDialog implements OnInit {

  messages: ChatMessageDTO[] = [];
  isLoading = true;

  constructor(
    public dialogRef: MatDialogRef<ChatHistoryDialog>,
    private chatService: ChatService
  ) {}

  ngOnInit(): void {
    this.cargarHistorial();
  }

  cargarHistorial(): void {
    this.isLoading = true;
    this.chatService.getChatHistory().subscribe({

      // --- 2. AÑADE EL TIPO AQUÍ ---
      next: (allMessages: ChatMessageDTO[]) => {
        this.messages = allMessages;
        this.isLoading = false;
      },
      error: (err) => {
        console.error("Error al cargar chat", err);
        this.isLoading = false;
      }
    });
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }
}
