import { Injectable } from '@nestjs/common';
import { StorageService } from '@tmo/shared/storage';
import { Book, ReadingListItem } from '@tmo/shared/models';

const KEY = '[okreads API] Reading List';

@Injectable()
export class ReadingListService {
  private readonly storage = new StorageService<ReadingListItem[]>(KEY, []);

  async getList(): Promise<ReadingListItem[]> {
    return this.storage.read();
  }

  async addBook(b: Book): Promise<void> {
    const { id, ...rest } = b;
    const newBookRecord = {
      bookId: b.id,
      ...rest,
    };
    this.storage.update((list) => {
      list.push(newBookRecord);
      return list;
    });
    return newBookRecord;
  }

  async removeBook(id: string): Promise<string> {
    this.storage.update((list) => {
      return list.filter((x) => x.bookId !== id);
    });
  }

  async updateBook(id: string): Promise<void> {
    let updatedState: ReadingListItem;
    this.storage.update((list) => {
      return list.map((data) => {
        if (data?.bookId === id) {
          updatedState = {
            ...data,
            finished: true,
            finishedDate: new Date().toISOString(),
          };
          return updatedState;
        } else {
          return data;
        }
      });
    });
    return updatedState;
  }
}
