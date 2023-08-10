import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';
import { AdminDoctorsComponent } from './admin-doctors/admin-doctors.component';
import { ChatTestComponent } from './chat-test/chat-test.component';
import { TokensComponent } from './tokens/tokens.component';
import { AdminNewsComponent } from './admin-news/admin-news.component';
import { AdminServicesComponent } from './admin-services/admin-services.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: 'doctors',
        component: AdminDoctorsComponent,
      },
      {
        path: 'chat',
        component: ChatTestComponent,
      },
      {
        path: 'tokens',
        component: TokensComponent,
      },
      {
        path: 'news',
        component: AdminNewsComponent,
      },
      {
        path: 'services',
        component: AdminServicesComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
