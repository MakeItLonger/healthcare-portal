import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { SortParams } from '../models/sort-params.model';

@Injectable({
  providedIn: 'root',
})
export class FiltersService {
  searchFilter$ = new BehaviorSubject<string>('');
  sortDir$ = new BehaviorSubject<SortParams>({
    element: 'createdAt',
    direction: 'asc',
  });
  currentPage$ = new BehaviorSubject<string>('0');
  currentLimit$ = new BehaviorSubject<string>('5');
  refreshTableData$ = new BehaviorSubject<boolean>(true);

  filters$ = combineLatest([
    this.searchFilter$.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      tap(() => this.currentPage$.next('0'))
    ),
    this.sortDir$.pipe(
      distinctUntilChanged(),
      tap(() => this.currentPage$.next('0'))
    ),
    this.currentLimit$.pipe(
      distinctUntilChanged(),
      tap(() => this.currentPage$.next('0'))
    ),
    this.currentPage$,
    this.refreshTableData$,
  ]).pipe(debounceTime(500));

  get currentPageObs$() {
    return this.currentPage$.asObservable();
  }

  get currentLimitObs$() {
    return this.currentLimit$.asObservable();
  }

  changeText(text: string) {
    this.searchFilter$.next(text);
  }

  changeSort(element: string, direction: string) {
    this.sortDir$.next({ element, direction });
  }
}
