import { fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { createReadingListItem, SharedTestingModule, updateReadingListItem} from '@tmo/shared/testing';

import { ReadingListComponent } from './reading-list.component';
import { BooksFeatureModule } from '@tmo/books/feature';
import { Store } from '@ngrx/store';
import { updateFinishedStatusOfReadingList } from '@tmo/books/data-access';

describe('ReadingListComponent', () => {
  let component: ReadingListComponent;
  let fixture: ComponentFixture<ReadingListComponent>;
  let store: Store;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [BooksFeatureModule, SharedTestingModule],
      providers: [Store],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadingListComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call store dispatch with updated status of book', () => {
    const book = createReadingListItem('A');
    const dispatchSpy = spyOn(store, 'dispatch');
    component.updateFinishedStatus(book);
    expect(dispatchSpy).toHaveBeenCalled();
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith(
      updateFinishedStatusOfReadingList({ bookId: book.bookId })
    );
  });
});
