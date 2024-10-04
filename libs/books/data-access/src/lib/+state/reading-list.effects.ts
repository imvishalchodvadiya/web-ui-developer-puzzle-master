import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, concatMap, exhaustMap, switchMap, map } from 'rxjs/operators';
import { ReadingListItem } from '@tmo/shared/models';
import * as ReadingListActions from './reading-list.actions';
import { Update } from '@ngrx/entity';

@Injectable()
export class ReadingListEffects implements OnInitEffects {
  loadReadingList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.init),
      exhaustMap(() =>
        this.http.get<ReadingListItem[]>('/api/reading-list').pipe(
          map((data) =>
            ReadingListActions.loadReadingListSuccess({ list: data })
          ),
          catchError((httpError: HttpErrorResponse) => {
            const error = httpError.message;
            return of(ReadingListActions.loadReadingListError({ error }));
          })
        )
      )
    )
  );

  addBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.addToReadingList),
      switchMap(({ book }) =>
        this.http.post<ReadingListItem>('/api/reading-list', book).pipe(
          map((item: ReadingListItem) =>
            ReadingListActions.confirmedAddToReadingList({ item })
          ),
          catchError((httpError: HttpErrorResponse) => {
            const error = httpError.message;
            return of(ReadingListActions.failedAddToReadingList({ error }));
          })
        )
      )
    )
  );

  updateBooks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.updateFinishedStatusOfReadingList),
      switchMap(({ bookId }) =>
        this.http
          .put<ReadingListItem>(`/api/reading-list/${bookId}/finished`, {})
          .pipe(
            map((item: ReadingListItem) => {
              const updatedItem: Update<ReadingListItem> = {
                id: item.bookId,
                changes: item,
              };
              return ReadingListActions.confirmedFinishedStatusOfReadingBook({
                updatedItem,
              });
            }),
            catchError((httpError: HttpErrorResponse) => {
              const error = httpError.message;
              return of(
                ReadingListActions.failedToUpdateFinishStatusReadingBook({
                  error,
                })
              );
            })
          )
      )
    )
  );

  removeBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.removeFromReadingList),
      exhaustMap(({ item }) =>
        this.http.delete<string>(`/api/reading-list/${item.bookId}`).pipe(
          map((bookId: string) => {
            return ReadingListActions.confirmedRemoveFromReadingList({
              bookId,
            });
          }),
          catchError((httpError: HttpErrorResponse) => {
            const error = httpError.message;
            return of(
              ReadingListActions.failedRemoveFromReadingList({ error })
            );
          })
        )
      )
    )
  );

  ngrxOnInitEffects() {
    return ReadingListActions.init();
  }

  constructor(private actions$: Actions, private http: HttpClient) {}
}
