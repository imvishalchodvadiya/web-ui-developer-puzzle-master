import {
  waitForAsync,
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SharedTestingModule } from '@tmo/shared/testing';

import { BooksFeatureModule } from '../books-feature.module';
import { BookSearchComponent } from './book-search.component';
import { FormBuilder } from '@angular/forms';
import { Store } from '@ngrx/store';
import { clearSearch, searchBooks } from '@tmo/books/data-access';
import { By } from '@angular/platform-browser';

describe('ProductsListComponent', () => {
  let component: BookSearchComponent;
  let fixture: ComponentFixture<BookSearchComponent>;
  let formBuilder: FormBuilder;
  let store: Store;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          BooksFeatureModule,
          NoopAnimationsModule,
          SharedTestingModule,
        ],
        providers: [Store, FormBuilder],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(BookSearchComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    formBuilder = TestBed.inject(FormBuilder);
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

  it('should call dispatach function on value change in the input', fakeAsync(() => {
    const dispatachSpy = spyOn(store, 'dispatch');
    const input = fixture.debugElement.query(By.css('input'));
    const el = input.nativeElement;

    expect(el.value).toBe('');

    el.value = 'JavaScript';
    el.dispatchEvent(new Event('input'));

    expect(component.searchTerm).toBe('JavaScript');

    tick(500);

    expect(dispatachSpy).toHaveBeenCalledWith(
      searchBooks({ term: 'JavaScript' })
    );
  }));
});
