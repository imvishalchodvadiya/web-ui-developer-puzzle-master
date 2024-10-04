import { TestBed } from '@angular/core/testing';
import { ReplaySubject } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { HttpTestingController } from '@angular/common/http/testing';

import { SharedTestingModule, updateReadingListItem } from '@tmo/shared/testing';
import { ReadingListEffects } from './reading-list.effects';
import * as ReadingListActions from './reading-list.actions';
import { ReadingListItem } from '@tmo/shared/models';
import { Update } from '@ngrx/entity';

describe('ToReadEffects', () => {
  let actions: ReplaySubject<any>;
  let effects: ReadingListEffects;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedTestingModule],
      providers: [
        ReadingListEffects,
        provideMockActions(() => actions),
        provideMockStore()
      ]
    });

    effects = TestBed.inject(ReadingListEffects);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('loadReadingList$', () => {
    it('should work', done => {
      actions = new ReplaySubject();
      actions.next(ReadingListActions.init());

      effects.loadReadingList$.subscribe(action => {
        expect(action).toEqual(
          ReadingListActions.loadReadingListSuccess({ list: [] })
        );
        done();
      });

      httpMock.expectOne('/api/reading-list').flush([]);
    });
  });

  describe('updateBooks$', () => {
    it('should work', (done) => {
      const item = updateReadingListItem('A');
      actions.next(
        ReadingListActions.updateFinishedStatusOfReadingList({
          bookId: item.bookId,
        })
      );
      effects.updateBooks$.subscribe((action) => {
        const updatedItem: Update<ReadingListItem> = {
          id: item.bookId,
          changes: item,
        };
        expect(action).toEqual(
          ReadingListActions.confirmedFinishedStatusOfReadingBook({ updatedItem })
        );
        done();
      });
      httpMock
        .expectOne(`/api/reading-list/${item.bookId}/finished`)
        .flush(item);
    });
  });
});
