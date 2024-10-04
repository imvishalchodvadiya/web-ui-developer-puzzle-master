import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { getReadingList, removeFromReadingList, addToReadingList } from '@tmo/books/data-access';
import { ReadingListItem } from '@tmo/shared/models';
import { MatSnackBar } from '@angular/material/snack-bar';
import { take } from 'rxjs/operators';

@Component({
  selector: 'tmo-reading-list',
  templateUrl: './reading-list.component.html',
  styleUrls: ['./reading-list.component.scss'],
})
export class ReadingListComponent {
  readingList$ = this.store.select(getReadingList);

  constructor(private readonly store: Store, private snackBar: MatSnackBar) {}

  removeFromReadingList(item): void {
    this.store.dispatch(removeFromReadingList({ item }));

    const snackBarRef = this.snackBar.open( `${item.title} removed from your book list....`, 'Undo', {
      duration: 5000,
    });

    const { bookId, ...rest } = item;
    const book = {
      ...rest,
      id: bookId,
    };

    snackBarRef.onAction().pipe(take(1)).subscribe(() => {
      this.store.dispatch(addToReadingList({ book }));
    });
  }
}
