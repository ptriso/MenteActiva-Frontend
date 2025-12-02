import { Component, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './chat-dialog.component.html',
  styleUrls: ['./chat-dialog.component.css']
})
export class ChatDialogComponent {

  lines: string[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {

    this.lines = data.chat
      .split('\n')
      .map((l: string) => l.trim())
      .filter((l: string) => l !== '');
  }

}

