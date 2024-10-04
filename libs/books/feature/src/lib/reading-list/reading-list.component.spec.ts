import { fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { createBook, createReadingListItem, SharedTestingModule } from '@tmo/shared/testing';

import { ReadingListComponent } from './reading-list.component';
import { BooksFeatureModule } from '@tmo/books/feature';
import { Store } from '@ngrx/store';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { addToReadingList, removeFromReadingList } from '@tmo/books/data-access';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('ReadingListComponent', () => {
  let component: ReadingListComponent;
  let fixture: ComponentFixture<ReadingListComponent>;
  let store: Store;
  let snackBar: MatSnackBar;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [BooksFeatureModule, SharedTestingModule, NoopAnimationsModule],
      providers: [Store, MatSnackBar],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadingListComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    snackBar = TestBed.inject(MatSnackBar);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should remove book from reading list', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    const book = createReadingListItem('A');

    component.removeFromReadingList(book);

    expect(dispatchSpy).toHaveBeenCalledWith(removeFromReadingList({ item: book }));
  });

  it('should remove book from reading list and undo using snack bar', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    const readingBook = createReadingListItem('H');
    const book = createBook('H');

    component.removeFromReadingList(readingBook);

    expect(dispatchSpy).toHaveBeenCalledWith(removeFromReadingList({ item: readingBook }));

    fixture.detectChanges();

    const snackBarButton = document.querySelector('div.mat-simple-snackbar-action button');
    expect(snackBarButton).not.toBeNull();
    snackBarButton?.dispatchEvent(new MouseEvent('click'));

    expect(dispatchSpy).toHaveBeenCalledWith(addToReadingList({ book }));
  });

});
