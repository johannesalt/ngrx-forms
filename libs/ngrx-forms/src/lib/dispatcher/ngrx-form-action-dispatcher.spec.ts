import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { MarkAsDirtyAction, MarkAsPristineAction, MarkAsTouchedAction, MarkAsUntouchedAction, ResetAction, SetValueAction } from '../actions';
import { NgrxFormActionDispatcher } from './ngrx-form-action-dispatcher';

describe(NgrxFormActionDispatcher.name, () => {
  let dispatcher: NgrxFormActionDispatcher;

  let store: { dispatch: () => void };
  beforeEach(() => {
    store = {
      dispatch: vi.fn(),
    };
  });

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [{ provide: Store, useValue: store }] });
  });

  beforeEach(() => {
    dispatcher = TestBed.inject(NgrxFormActionDispatcher);
  });

  it(`should dispatch a ${MarkAsDirtyAction.name} to the global store`, () => {
    dispatcher.markAsDirty('test');

    expect(store.dispatch).toHaveBeenCalledExactlyOnceWith(new MarkAsDirtyAction('test'));
  });

  it(`should dispatch a ${MarkAsPristineAction.name} to the global store`, () => {
    dispatcher.markAsPristine('test');

    expect(store.dispatch).toHaveBeenCalledExactlyOnceWith(new MarkAsPristineAction('test'));
  });

  it(`should dispatch a ${MarkAsTouchedAction.name} to the global store`, () => {
    dispatcher.markAsTouched('test');

    expect(store.dispatch).toHaveBeenCalledExactlyOnceWith(new MarkAsTouchedAction('test'));
  });

  it(`should dispatch a ${MarkAsUntouchedAction.name} to the global store`, () => {
    dispatcher.markAsUntouched('test');

    expect(store.dispatch).toHaveBeenCalledExactlyOnceWith(new MarkAsUntouchedAction('test'));
  });

  it(`should dispatch a ${ResetAction.name} to the global store`, () => {
    dispatcher.reset('test');

    expect(store.dispatch).toHaveBeenCalledExactlyOnceWith(new ResetAction('test'));
  });

  it(`should dispatch a ${SetValueAction.name} to the global store`, () => {
    dispatcher.setValue('test', 'hello world');

    expect(store.dispatch).toHaveBeenCalledExactlyOnceWith(new SetValueAction('test', 'hello world'));
  });
});
