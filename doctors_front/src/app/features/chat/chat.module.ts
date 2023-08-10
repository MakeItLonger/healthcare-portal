import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatComponent } from './chat.component';

import { DoctorsService } from 'src/app/core/services/doctors.service';
import { MatButtonModule } from '@angular/material/button';
import { ChatService } from '../../core/services/chat.service';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [ChatComponent],
  providers: [DoctorsService, ChatService],
  imports: [
    CommonModule,
    MatButtonModule,
    MatChipsModule,
    MatInputModule,
    CdkDropList,
    CdkDrag,
    MatSelectModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatIconModule,
  ],
  exports: [ChatComponent],
})
export class ChatModule {}
