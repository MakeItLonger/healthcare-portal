import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from "./dashboard.component";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatButtonModule} from "@angular/material/button";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatCardModule} from "@angular/material/card";
import {RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {MatListModule} from "@angular/material/list";
import {MatIconModule} from "@angular/material/icon";
import {DashboardRoutingModule} from "./dashboard-routing.module";
import { ProfileComponent } from './profile/profile.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { AppointmentsComponent } from './appointments/appointments.component';
import {MatTableModule} from "@angular/material/table";
import {MatMenuModule} from "@angular/material/menu";
import { ReceiptComponent } from './receipt/receipt.component';
import {MatDialogModule} from "@angular/material/dialog";
import {DashboardGuard} from "./dashboard.guard";
import {MatDatepickerModule} from "@angular/material/datepicker";


@NgModule({
  declarations: [DashboardComponent, ProfileComponent, AppointmentsComponent, ReceiptComponent],
  providers: [DashboardGuard],
    imports: [
        CommonModule,
        MatToolbarModule,
        MatButtonModule,
        MatSidenavModule,
        MatCardModule,
        RouterOutlet,
        MatListModule,
        RouterLink,
        RouterLinkActive,
        MatIconModule,
        DashboardRoutingModule,
        MatFormFieldModule,
        MatInputModule,
        MatProgressSpinnerModule,
        FormsModule,
        ReactiveFormsModule,
        MatTableModule,
        MatMenuModule,
        MatDialogModule,
        MatDatepickerModule
    ],
  exports: [DashboardComponent]
})
export class DashboardModule {}
