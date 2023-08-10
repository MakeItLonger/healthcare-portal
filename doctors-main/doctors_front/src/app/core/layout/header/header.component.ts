import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';
import { Navigation, Router } from '@angular/router';
import {Observable, Subject, Subscriber, Subscription} from "rxjs";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  role: string
  constructor(private auth: AuthService, private router: Router) {

    this.auth
      .getAuthStatusListener()
      .subscribe((x) => {
        this.isAuth = x as boolean
        this.role = this.auth.getRole()
      });
  }

  isAuth: boolean = false;
  ngOnInit() {}

  login() {
    if (this.isAuth) {
      this.auth.logout();
      this.router.navigate(['/']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  navigation = [
    { label: 'Clinic info', link: '/clinic-info' },
    { label: 'Doctors', link: '/doctors' },
    { label: 'Services', link: '/services' },
    { label: 'News', link: '/news' },
    { label: 'Contact Us', link: '/contacts' },
  ];

  ngOnDestroy(): void {
  }
}
