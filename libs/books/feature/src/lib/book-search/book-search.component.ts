import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { addToReadingList,
  clearSearch,
  getAllBooks,
  ReadingListBook,
  removeFromReadingList,
  searchBooks,
} from '@tmo/books/data-access';
import { FormBuilder } from '@angular/forms';
import { Book, ReadingListItem  } from '@tmo/shared/models';
import { MatSnackBar} from '@angular/material/snack-bar';
import { take } from 'rxjs/operators';

@Component({
  selector: 'tmo-book-search',
  templateUrl: './book-search.component.html',
  styleUrls: ['./book-search.component.scss']
})
export class BookSearchComponent implements OnInit {
  books: ReadingListBook[];

  searchForm = this.fb.group({
    term: ''
  });

  constructor(
    private readonly store: Store,
    private readonly fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {}

  get searchTerm(): string {
    return this.searchForm.value.term;
  }

  ngOnInit(): void {
    this.store.select(getAllBooks).subscribe(books => {
      this.books = books;
    });
  }

  formatDate(date: void | string) {
    return date
      ? new Intl.DateTimeFormat('en-US').format(new Date(date))
      : undefined;
  }

  addBookToReadingList(book: Book): void {
    this.store.dispatch(addToReadingList({ book }));
    const snackBarRef = this.snackBar.open(
      `${book.title} added to your book list....`,
      'Undo',
      {
        duration: 3000,
      }
    );

    snackBarRef.onAction().pipe(take(1)).subscribe(() => {
      const { id, ...rest } = book;
      const item: ReadingListItem = {
        ...rest,
        bookId: id,
      };

      this.store.dispatch(removeFromReadingList({ item }));
    });

  }

  searchExample(): void {
    this.searchForm.controls.term.setValue('javascript');
    this.searchBooks();
  }

  searchBooks(): void {
    if (this.searchForm.value.term) {
      this.store.dispatch(searchBooks({ term: this.searchTerm }));
    } else {
      this.store.dispatch(clearSearch());
    }
  }

  clearSearch(): void {
    this.searchForm.reset();
    this.store.dispatch(clearSearch());
  }
}
