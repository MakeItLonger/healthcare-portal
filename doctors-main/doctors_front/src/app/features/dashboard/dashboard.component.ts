import {Component, OnDestroy} from '@angular/core';
import {Subscription} from "rxjs";
import {NavigationEnd, Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {FiltersService} from "../../core/services/filters.service";
import {DoctorsEditComponent} from "../admin/doctors-edit/doctors-edit.component";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnDestroy{

  routed = false;
  events$!: Subscription;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private filtersService: FiltersService
  ) {
    this.events$ = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const url = event.url;
        const childUrl = url.slice(6);
        if (childUrl) {
          this.routed = true;
        }
      }
    });
  }

  openCreateForm() {
    const dialogCreateRef = this.dialog.open(DoctorsEditComponent);
    dialogCreateRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.filtersService.refreshTableData$.next(true);
        }
      },
    });
  }

  ngOnDestroy(): void {
    this.events$.unsubscribe();
  }

}
