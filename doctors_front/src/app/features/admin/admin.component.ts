import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DoctorsEditComponent } from './doctors-edit/doctors-edit.component';
import { FiltersService } from 'src/app/core/services/filters.service';
import { AuthAdminService } from 'src/app/core/services/auth-admin.service';
import { ConfirmationModalService } from 'src/app/core/services/confirmation-modal.service';
import { NewsEditComponent } from './news-edit/news-edit.component';
import { ServicesEditComponent } from './services-edit/services-edit.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit, OnDestroy {
  routed = false;
  childUrl: string = '';
  events$!: Subscription;
  isLoggedIn$!: Subscription;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private filtersService: FiltersService,
    private authAdminService: AuthAdminService,
    private confirmationModalService: ConfirmationModalService
  ) {
    this.events$ = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const url = event.url;
        this.childUrl = url.slice(6);
        if (this.childUrl) {
          this.routed = true;
        }
      }
    });
  }

  ngOnInit(): void {
    this.authAdminService.getCurrentAdmin().subscribe({
      next: (currentAdmin) => {
        this.authAdminService.setCurrentAdmin(currentAdmin);
      },
      error: (err) => {
        this.authAdminService.setCurrentAdmin(null);
      },
    });

    this.isLoggedIn$ = this.authAdminService.isLogged$.subscribe(
      (isLoggedIn) => {
        if (!isLoggedIn) {
          this.router.navigateByUrl('/admin/auth');
        }
      }
    );
  }

  openCreateForm() {
    let dialogCreateRef;
    switch (this.childUrl) {
      case '/doctors':
        dialogCreateRef = this.dialog.open(DoctorsEditComponent);
        break;
      case '/news':
        dialogCreateRef = this.dialog.open(NewsEditComponent);
        break;
      case '/services':
        dialogCreateRef = this.dialog.open(ServicesEditComponent);
        break;
    }

    if (!dialogCreateRef) {
      return;
    }

    dialogCreateRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.filtersService.refreshTableData$.next(true);
        }
      },
    });
  }

  logout() {
    this.confirmationModalService
      .openConfirmationModal('Are you sure you want to log out?')
      .then((confirmed) => {
        if (confirmed) {
          localStorage.removeItem('tokenAdmin');
          this.router.navigate(['/admin/auth']);
        }
      });
  }

  ngOnDestroy(): void {
    this.events$.unsubscribe();
    this.isLoggedIn$.unsubscribe();
  }
}
