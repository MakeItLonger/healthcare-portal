import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { HomeModule } from './features/home/home.module';
import { AdminModule } from './features/admin/admin.module';
import { AuthModule } from './core/auth/auth.module';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AppointmentModule } from './features/appointment/appointment.module';
import { tokenLoginService } from './core/services/tokenLogin.service';
import { ConfirmationModalComponent } from './shared/confirmation-modal/confirmation-modal.component';
import { MatToolbarModule } from '@angular/material/toolbar';

import { MatDialogModule } from '@angular/material/dialog';
import { DashboardModule } from './features/dashboard/dashboard.module';

@NgModule({
  declarations: [AppComponent, ConfirmationModalComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HomeModule,
    AdminModule,
    AuthModule,
    AppointmentModule,
    HttpClientModule,
    MatInputModule,
    MatButtonModule,
    DashboardModule,
    MatToolbarModule,
    MatDialogModule,
  ],
  providers: [tokenLoginService],
  bootstrap: [AppComponent],
})
export class AppModule {}
