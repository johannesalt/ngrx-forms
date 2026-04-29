import { TestBed } from '@angular/core/testing';
import { Dispatcher } from '@ngrx/signals/events';
import {
  addArrayControl,
  addGroupControl,
  clearAsyncError,
  disable,
  enable,
  focus,
  markAsDirty,
  markAsPristine,
  markAsSubmitted,
  markAsTouched,
  markAsUnsubmitted,
  markAsUntouched,
  moveArrayControl,
  removeArrayControl,
  removeGroupControl,
  reset,
  setAsyncError,
  setErrors,
  setUserDefinedProperty,
  setValue,
  startAsyncValidation,
  swapArrayControl,
  unfocus,
} from '../events';
import { SignalStoreFormActionDispatcher } from './signal-store-form-action-dispatcher';

describe('SignalStoreFormActionDispatcher', () => {
  let dispatcher: Partial<Dispatcher>;
  beforeEach(() => {
    dispatcher = { dispatch: vi.fn() };
  });

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [{ provide: Dispatcher, useValue: dispatcher }] });
  });

  let formActionDispatcher: SignalStoreFormActionDispatcher;
  beforeEach(() => {
    formActionDispatcher = TestBed.inject(SignalStoreFormActionDispatcher);
  });

  it(`should dispatch ${addArrayControl.type} event`, () => {
    formActionDispatcher.addArrayControl('test Id', 1);

    expect(dispatcher.dispatch).toHaveBeenCalledExactlyOnceWith(addArrayControl({ controlId: 'test Id', index: undefined, value: 1 }));
  });

  it(`should dispatch ${addGroupControl.type} event`, () => {
    formActionDispatcher.addGroupControl('test', 'userName', 'max.mustermann');

    expect(dispatcher.dispatch).toHaveBeenCalledExactlyOnceWith(addGroupControl({ controlId: 'test', name: 'userName', value: 'max.mustermann' }));
  });

  it(`should dispatch ${clearAsyncError.type} event`, () => {
    formActionDispatcher.clearAsyncError('test', 'userName');

    expect(dispatcher.dispatch).toHaveBeenCalledExactlyOnceWith(clearAsyncError({ controlId: 'test', name: 'userName' }));
  });

  it(`should dispatch ${disable.type} event`, () => {
    formActionDispatcher.disable('test');

    expect(dispatcher.dispatch).toHaveBeenCalledExactlyOnceWith(disable({ controlId: 'test' }));
  });

  it(`should dispatch ${enable.type} event`, () => {
    formActionDispatcher.enable('test');

    expect(dispatcher.dispatch).toHaveBeenCalledExactlyOnceWith(enable({ controlId: 'test' }));
  });

  it(`should dispatch ${focus.type} event`, () => {
    formActionDispatcher.focus('test');

    expect(dispatcher.dispatch).toHaveBeenCalledExactlyOnceWith(focus({ controlId: 'test' }));
  });

  it(`should dispatch ${markAsDirty.type} event`, () => {
    formActionDispatcher.markAsDirty('test');

    expect(dispatcher.dispatch).toHaveBeenCalledExactlyOnceWith(markAsDirty({ controlId: 'test' }));
  });

  it(`should dispatch ${markAsPristine.type} event`, () => {
    formActionDispatcher.markAsPristine('test');

    expect(dispatcher.dispatch).toHaveBeenCalledExactlyOnceWith(markAsPristine({ controlId: 'test' }));
  });

  it(`should dispatch ${markAsSubmitted.type} event`, () => {
    formActionDispatcher.markAsSubmitted('test');

    expect(dispatcher.dispatch).toHaveBeenCalledExactlyOnceWith(markAsSubmitted({ controlId: 'test' }));
  });

  it(`should dispatch ${markAsTouched.type} event`, () => {
    formActionDispatcher.markAsTouched('test');

    expect(dispatcher.dispatch).toHaveBeenCalledExactlyOnceWith(markAsTouched({ controlId: 'test' }));
  });

  it(`should dispatch ${markAsUnsubmitted.type} event`, () => {
    formActionDispatcher.markAsUnsubmitted('test');

    expect(dispatcher.dispatch).toHaveBeenCalledExactlyOnceWith(markAsUnsubmitted({ controlId: 'test' }));
  });

  it(`should dispatch ${markAsUntouched.type} event`, () => {
    formActionDispatcher.markAsUntouched('test');

    expect(dispatcher.dispatch).toHaveBeenCalledExactlyOnceWith(markAsUntouched({ controlId: 'test' }));
  });

  it(`should dispatch ${moveArrayControl.type} event`, () => {
    formActionDispatcher.moveArrayControl('test', 3, 1);

    expect(dispatcher.dispatch).toHaveBeenCalledExactlyOnceWith(moveArrayControl({ controlId: 'test', fromIndex: 3, toIndex: 1 }));
  });

  it(`should dispatch ${removeArrayControl.type} event`, () => {
    formActionDispatcher.removeArrayControl('test', 2);

    expect(dispatcher.dispatch).toHaveBeenCalledExactlyOnceWith(removeArrayControl({ controlId: 'test', index: 2 }));
  });

  it(`should dispatch ${removeGroupControl.type} event`, () => {
    formActionDispatcher.removeGroupControl('test', 'userName');

    expect(dispatcher.dispatch).toHaveBeenCalledExactlyOnceWith(removeGroupControl({ controlId: 'test', name: 'userName' }));
  });

  it(`should dispatch ${reset.type} event`, () => {
    formActionDispatcher.reset('test');

    expect(dispatcher.dispatch).toHaveBeenCalledExactlyOnceWith(reset({ controlId: 'test' }));
  });

  it(`should dispatch ${setAsyncError.type} event`, () => {
    formActionDispatcher.setAsyncError('test', 'userName', { required: true });

    expect(dispatcher.dispatch).toHaveBeenCalledExactlyOnceWith(setAsyncError({ controlId: 'test', name: 'userName', value: { required: true } }));
  });

  it(`should dispatch ${setErrors.type} event`, () => {
    formActionDispatcher.setErrors('test.userName', { required: { actual: null } });

    expect(dispatcher.dispatch).toHaveBeenCalledExactlyOnceWith(setErrors({ controlId: 'test.userName', errors: { required: { actual: null } } }));
  });

  it(`should dispatch ${setUserDefinedProperty.type} event`, () => {
    formActionDispatcher.setUserDefinedProperty('test.userName', '_previous', 'max');

    expect(dispatcher.dispatch).toHaveBeenCalledExactlyOnceWith(setUserDefinedProperty({ controlId: 'test.userName', name: '_previous', value: 'max' }));
  });

  it(`should dispatch ${setValue.type} event`, () => {
    formActionDispatcher.setValue('test', 'hello world');

    expect(dispatcher.dispatch).toHaveBeenCalledExactlyOnceWith(setValue({ controlId: 'test', value: 'hello world' }));
  });

  it(`should dispatch ${startAsyncValidation.type} event`, () => {
    formActionDispatcher.startAsyncValidation('test.userName', 'unique');

    expect(dispatcher.dispatch).toHaveBeenCalledExactlyOnceWith(startAsyncValidation({ controlId: 'test.userName', name: 'unique' }));
  });

  it(`should dispatch ${swapArrayControl.type} event`, () => {
    formActionDispatcher.swapArrayControl('test.skills', 4, 6);

    expect(dispatcher.dispatch).toHaveBeenCalledExactlyOnceWith(swapArrayControl({ controlId: 'test.skills', fromIndex: 4, toIndex: 6 }));
  });

  it(`should dispatch ${unfocus.type} event`, () => {
    formActionDispatcher.unfocus('test');

    expect(dispatcher.dispatch).toHaveBeenCalledExactlyOnceWith(unfocus({ controlId: 'test' }));
  });
});
