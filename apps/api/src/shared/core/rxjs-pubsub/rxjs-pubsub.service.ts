import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable()
export class RxjsPubsubService implements OnModuleDestroy {
  private topics = new Map<string, ReplaySubject<any>>();

  /** Lấy hoặc tạo subject cho 1 event */
  private getOrCreateSubject<T = any>(event: string): ReplaySubject<T> {
    if (!this.topics.has(event)) {
      this.topics.set(event, new ReplaySubject<T>(1)); // lưu giá trị cuối
    }
    return this.topics.get(event) as ReplaySubject<T>;
  }

  /** Publish data tới 1 event */
  publish<T = any>(event: string, data: T) {
    this.getOrCreateSubject<T>(event).next(data);
  }

  /** Subscribe để lắng nghe 1 event */
  subscribe<T = any>(event: string): Observable<T> {
    return this.getOrCreateSubject<T>(event).asObservable();
  }

  /** Dọn dẹp khi app shutdown */
  onModuleDestroy() {
    this.topics.forEach((subject) => subject.complete());
    this.topics.clear();
  }
}
