import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { createBook, createReadingListItem, SharedTestingModule } from '@tmo/shared/testing';
import { async, ComponentFixture, fakeAsync, TestBed} from '@angular/core/testing';
import { BooksFeatureModule } from '../books-feature.module';
import { BookSearchComponent } from './book-search.component';
import { FormBuilder } from '@angular/forms';
import { Store } from '@ngrx/store';
import { clearSearch, removeFromReadingList } from '@tmo/books/data-access';
import { addToReadingList } from '@tmo/books/data-access';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('ProductsListComponent', () => {
  let component: BookSearchComponent;
  let fixture: ComponentFixture<BookSearchComponent>;
  let formBuilder: FormBuilder;
  let store: Store;
  let snackBar: MatSnackBar;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [BooksFeatureModule, NoopAnimationsModule, SharedTestingModule],
      providers: [Store, FormBuilder, MatSnackBar],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookSearchComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    formBuilder = TestBed.inject(FormBuilder);
    snackBar = TestBed.inject(MatSnackBar);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should call clear dispatach function', () => {
    const dispatachSpy = spyOn(store, 'dispatch');
    component.clearSearch();
    expect(dispatachSpy).toHaveBeenCalledWith(clearSearch());
  });

  it('should add book to reading list', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    const book = createBook('H');

    component.addBookToReadingList(book);

    expect(dispatchSpy).toHaveBeenCalledWith(addToReadingList({ book }));
  });

  it('should add book to reading list and undo using snack bar', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    const book = createBook('H');
    const item = createReadingListItem('H');

    component.addBookToReadingList(book);

    expect(dispatchSpy).toHaveBeenCalledWith(addToReadingList({ book }));

    fixture.detectChanges();

    const snackBarButton = document.querySelector('div.mat-simple-snackbar-action button');
    expect(snackBarButton).not.toBeNull();
    snackBarButton?.dispatchEvent(new MouseEvent('click'));

    expect(dispatchSpy).toHaveBeenCalledWith(removeFromReadingList({ item }));
  });

});
