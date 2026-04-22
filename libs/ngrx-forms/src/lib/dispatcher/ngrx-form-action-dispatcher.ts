import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions } from '../actions';
import { BaseFormActionDispatcher } from './base-form-action-dispatcher';

@Injectable({ providedIn: 'root' })
export class NgrxFormActionDispatcher<TValue = any> extends BaseFormActionDispatcher<TValue> {
  /**
   * Provides access to the global application (NGRX) store.
   */
  private readonly store = inject(Store);

  /**
   * @inheritdoc
   */
  protected override dispatch(action: Actions<TValue>): void {
    this.store.dispatch(action);
  }
}
