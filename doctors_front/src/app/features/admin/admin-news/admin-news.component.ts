import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { NewsService } from 'src/app/core/services/news.service';
import { distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NewsEditComponent } from '../news-edit/news-edit.component';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { FiltersService } from 'src/app/core/services/filters.service';
import { QueryRequest } from 'src/app/core/models/query-request.model';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { News } from 'src/app/core/models/news.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-admin-news',
  templateUrl: './admin-news.component.html',
  styleUrls: ['./admin-news.component.scss'],
})
export class AdminNewsComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    '_id',
    'title',
    'content',
    'createdAt',
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
    private newsService: NewsService,
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
          ): Observable<{ news: News[]; total: number }> => {
            return this.newsService.getNewsByQueryParams(queryResuest);
          }
        )
      )
      .subscribe((res: { news: News[]; total: number }) => {
        this.isLoading$.next(false);
        this.getTableData(res.news);
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

  getTableData(news: News[]) {
    this.dataSource = new MatTableDataSource(news);
  }

  deleteNews(id: number) {
    this.newsService.deleteNews(id).subscribe({
      next: (news: News) => {
        this.snackBarService.openSnackBar(
          `Article ${news.title} has been deleted`,
          'done'
        );
        this.filtersService.refreshTableData$.next(true);
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
      },
    });
  }

  openConfirmationDialog(id: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent);

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.deleteNews(id);
      }
    });
  }

  openEditForm(data: any) {
    data.display = data.picture.public_id;
    delete data.picture;

    const dialogCreateRef = this.dialog.open(NewsEditComponent, {
      data,
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
