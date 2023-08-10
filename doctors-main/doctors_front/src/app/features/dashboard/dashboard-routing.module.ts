import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {DashboardComponent} from "./dashboard.component";
import {ChatTestComponent} from "../admin/chat-test/chat-test.component";
import {ChatComponent} from "../chat/chat.component";
import {ProfileComponent} from "./profile/profile.component";
import {AppointmentsComponent} from "./appointments/appointments.component";
import {DashboardGuard} from "./dashboard.guard";


const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [DashboardGuard],
    children: [
      {
        path: 'chat',
        component: ChatTestComponent,
        children: [
          {
            path: ':id',
            component: ChatComponent
          }
        ]
      },
      {
        path: 'profile',
        component: ProfileComponent
      },
      {
        path: 'appointments',
        component: AppointmentsComponent
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
