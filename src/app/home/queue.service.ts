import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export const routes = {
  queue: (c: Queue) => `https://sqs.eu-central-1.amazonaws.com/800070360327/${c.name}`
};

export interface Queue {
  // The queue's category: 'dev', 'explicit'...
  name: string;
}

@Injectable()
export class QueueService {

  constructor(private httpClient: HttpClient) { }

  queuePush(context: Queue, message: any): Observable<any> {
    return this.httpClient
      .cache()
      .post(routes.queue(context), message)
      .pipe(
        map((body: any) => body),
        catchError((e) => of(e))
      );
  }
  queuePop(context: Queue): Observable<any> {
    return this.httpClient
      .cache()
      .get(routes.queue(context))
      .pipe(
        map((body: any) => body.value),
        catchError((e) => of(e))
      );
  }

}
