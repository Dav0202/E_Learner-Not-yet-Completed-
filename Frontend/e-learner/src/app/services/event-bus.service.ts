import { Injectable } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EventBusService {
  private subject$ = new Subject<any>();

  constructor() { }

  emit(event: any) {
    this.subject$.next(event);
  }

  on(eventName: string, action: any): Subscription {
    return this.subject$.pipe(
      filter((e: any) => e.name === eventName),
      map((e: any) => e["value"])).subscribe(action);
  }
}
