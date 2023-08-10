import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeComponent } from './home.component';
import { DoctorsListComponent } from './doctors-list/doctors-list.component';
import { DoctorComponent } from './doctors-list/doctor/doctor.component';
import { DoctorsService } from 'src/app/core/services/doctors.service';
import { HomeRoutingModule } from './home-routing.module';
import { FooterComponent } from '../../core/layout/footer/footer.component';
import { HeaderComponent } from '../../core/layout/header/header.component';
import { ChatModule } from '../chat/chat.module';
import { MatButtonModule } from '@angular/material/button';
import { NewsBlockComponent } from './news-block/news-block.component';
import { NewsArticleComponent } from './news-block/news-article/news-article.component';
import { NewsService } from '../../core/services/news.service';
import { MatDialogModule } from '@angular/material/dialog';
import { ServiceListComponent } from './service-list/service-list.component';
import { ServicesService } from '../../core/services/services.service';
import { ChatBlockComponent } from './chat-block/chat-block.component';
import {MatIconModule} from "@angular/material/icon";

@NgModule({
  declarations: [
    HomeComponent,
    DoctorsListComponent,
    DoctorComponent,
    FooterComponent,
    HeaderComponent,
    NewsBlockComponent,
    NewsArticleComponent,
    ServiceListComponent,
    ChatBlockComponent,
  ],
  providers: [DoctorsService, NewsService, ServicesService],
  imports: [
    CommonModule,
    HomeRoutingModule,
    ChatModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule
  ],
  exports: [HeaderComponent],
})
export class HomeModule {}
