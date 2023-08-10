import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { DoctorsService } from 'src/app/core/services/doctors.service';
import { distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DoctorsEditComponent } from '../doctors-edit/doctors-edit.component';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { FiltersService } from 'src/app/core/services/filters.service';
import { QueryRequest } from 'src/app/core/models/query-request.model';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Doctor } from 'src/app/core/models/doctor.model';

@Component({
  selector: 'app-admin-doctors',
  templateUrl: './admin-doctors.component.html',
  styleUrls: ['./admin-doctors.component.scss'],
})
export class AdminDoctorsComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    '_id',
    'first_name',
    'second_name',
    'position',
    'description',
    'appointmentDays',
    'timeSchedule',
    'action',
  ];
  dataSource!: MatTableDataSource<any>;

  currentPage$ = this.filtersService.currentPageObs$;
  currentLimit$ = this.filtersService.currentLimitObs$;

  total$ = new Subject<number>();
  isLoading$ = new BehaviorSubject<boolean>(true);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private doctorsService: DoctorsService,
    private dialog: MatDialog,
    private snackBarService: SnackbarService,
    private filtersService: FiltersService
  ) {}

  ngOnInit(): void {
    this.filtersService.filters$
      .pipe(
        distinctUntilChanged(),
        map(([search, sort, limit, page]): QueryRequest => {
          return { search, sort, limit, page };
        }),
        switchMap(
          (
            queryResuest: QueryRequest
          ): Observable<{ doctors: Doctor[]; total: number }> => {
            return this.doctorsService.getDoctorsByQueryParams(queryResuest);
          }
        )
      )
      .subscribe((res: { doctors: Doctor[]; total: number }) => {
        this.isLoading$.next(false);
        this.getTableData(res.doctors);
        this.total$.next(res.total);
      });
  }

  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe((sort: Sort) => {
      this.filtersService.changeSort(sort.active, sort.direction);
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filtersService.searchFilter$.next(filterValue);
  }

  getTableData(doctors: Doctor[]) {
    const doctorsData = doctors.map((doctor) => {
      if (typeof doctor.appointmentDays === 'string') {
        doctor.appointmentDays = doctor.appointmentDays.split(',');
      }
      return doctor;
    });
    this.dataSource = new MatTableDataSource(doctorsData);
  }

  deleteDoctor(id: number) {
    this.doctorsService.deleteDoctor(id).subscribe({
      next: (doctor) => {
        this.snackBarService.openSnackBar(
          `Dr. ${doctor.first_name} ${doctor.second_name} has been deleted`,
          'done'
        );
        this.filtersService.refreshTableData$.next(true);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  openConfirmationDialog(id: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent);

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.deleteDoctor(id);
      }
    });
  }

  openEditForm(data: any) {
    data.display = data.avatar.public_id;
    delete data.avatar;

    const dialogCreateRef = this.dialog.open(DoctorsEditComponent, {
      data: {
        ...data,
        appointmentDays: [
          ...data.appointmentDays.map((num: string): number => Number(num)),
        ],
        timeSchedule: data.timeSchedule.split(','),
      },
    });

    dialogCreateRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.filtersService.refreshTableData$.next(true);
        }
      },
    });
  }

  handlePageEvent(pageEvent: PageEvent) {
    this.filtersService.currentLimit$.next(String(pageEvent.pageSize));

    this.filtersService.currentPage$.next(String(pageEvent.pageIndex));

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  handleSearchInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.filtersService.searchFilter$.next(value);
  }
}
