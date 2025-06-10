import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ClearAsyncErrorAction, SetAsyncErrorAction, StartAsyncValidationAction } from '@johannes-it-solution/ngrx-forms';
import { createEffect } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import { concat, Observable, timer } from 'rxjs';
import { catchError, distinct, filter, map, mergeMap, switchMap } from 'rxjs/operators';
import { SetSearchResultAction, State } from './async-validation.reducer';

@Injectable()
export class AsyncValidationEffects {
  private readonly httpClient = inject(HttpClient);

  private readonly store = inject(Store<State>);

  public readonly searchBooks$: Observable<Action> = createEffect(() => {
    return this.store.pipe(
      select((s) => s.asyncValidation.formState),
      filter((fs) => !!fs.value.searchTerm && fs.controls.numberOfResultsToShow.isValid),
      distinct((fs) => fs.value),
      switchMap((fs) =>
        concat(
          timer(300).pipe(map(() => new StartAsyncValidationAction(fs.controls.searchTerm.id, 'exists'))),
          this.httpClient
            .get(`https://www.googleapis.com/books/v1/volumes`, {
              params: {
                q: fs.value.searchTerm,
                maxResults: `${fs.value.numberOfResultsToShow}`,
              },
            })
            .pipe(
              mergeMap((resp: any) => {
                if (resp.totalItems > 0) {
                  return [
                    new SetSearchResultAction(resp.items.map((i: any) => i.volumeInfo.title)),
                    new ClearAsyncErrorAction(fs.controls.searchTerm.id, 'exists'),
                  ] as Action[];
                }

                return [new SetSearchResultAction([]), new SetAsyncErrorAction(fs.controls.searchTerm.id, 'exists', fs.value.searchTerm)];
              }),
              catchError(() => [new SetSearchResultAction([]), new SetAsyncErrorAction(fs.controls.searchTerm.id, 'exists', fs.value.searchTerm)])
            )
        )
      )
    );
  });
}
