import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { AdminRoutingModule } from './admin-routing.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { AuthAdminModule } from './auth-admin/auth-admin.module';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthAdminInterceptor } from 'src/app/core/services/auth-admin-interceptor.service';

import { AdminComponent } from './admin.component';
import { AdminDoctorsComponent } from './admin-doctors/admin-doctors.component';
import { DoctorsEditComponent } from './doctors-edit/doctors-edit.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { ChatTestComponent } from './chat-test/chat-test.component';
import { ChatModule } from '../chat/chat.module';
import { TokensComponent } from './tokens/tokens.component';
import { AdminNewsComponent } from './admin-news/admin-news.component';
import { NewsEditComponent } from './news-edit/news-edit.component';
import { ServicesEditComponent } from './services-edit/services-edit.component';
import { AdminServicesComponent } from './admin-services/admin-services.component';

@NgModule({
  declarations: [
    AdminComponent,
    AdminDoctorsComponent,
    DoctorsEditComponent,
    ConfirmationDialogComponent,
    ChatTestComponent,
    TokensComponent,
    AdminNewsComponent,
    NewsEditComponent,
    ServicesEditComponent,
    AdminServicesComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    NgxMaterialTimepickerModule,
    MatSelectModule,
    MatChipsModule,
    AuthAdminModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthAdminInterceptor,
      multi: true,
    },
  ],
})
export class AdminModule {}
