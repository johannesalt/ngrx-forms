import { TestBed } from '@angular/core/testing';
import { signalStore } from '@ngrx/signals';
import { SignalStoreFormActionDispatcher } from './dispatcher/signal-store-form-action-dispatcher';
import { withFormMethods } from './methods';
import { SignalFormMethods } from './types';

describe('withFormMethods', () => {
  let dispatcher: Partial<SignalStoreFormActionDispatcher>;
  beforeEach(() => {
    dispatcher = {
      addArrayControl: vi.fn(),
      addGroupControl: vi.fn(),
      clearAsyncError: vi.fn(),
      disable: vi.fn(),
      enable: vi.fn(),
      focus: vi.fn(),
      markAsDirty: vi.fn(),
      markAsPristine: vi.fn(),
      markAsSubmitted: vi.fn(),
      markAsTouched: vi.fn(),
      markAsUnsubmitted: vi.fn(),
      markAsUntouched: vi.fn(),
      moveArrayControl: vi.fn(),
      removeArrayControl: vi.fn(),
      removeGroupControl: vi.fn(),
      reset: vi.fn(),
      setAsyncError: vi.fn(),
      setErrors: vi.fn(),
      setUserDefinedProperty: vi.fn(),
      setValue: vi.fn(),
      startAsyncValidation: vi.fn(),
      swapArrayControl: vi.fn(),
      unfocus: vi.fn(),
    };
  });

  let state: SignalFormMethods & any;
  beforeEach(() => {
    state = signalStore(withFormMethods());
  });

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [state, { provide: SignalStoreFormActionDispatcher, useValue: dispatcher }] });
  });

  let store: any & SignalFormMethods;
  beforeEach(() => {
    store = TestBed.inject(state);
  });

  it(`should call addArrayControl`, () => {
    store.addArrayControl('test', 1);

    expect(dispatcher.addArrayControl).toHaveBeenCalledExactlyOnceWith('test', 1);
  });

  it(`should call addGroupControl`, () => {
    store.addGroupControl('test', 'userName', 'max.mustermann');

    expect(dispatcher.addGroupControl).toHaveBeenCalledExactlyOnceWith('test', 'userName', 'max.mustermann');
  });

  it(`should call clearAsyncError`, () => {
    store.clearAsyncError('test', 'userName');

    expect(dispatcher.clearAsyncError).toHaveBeenCalledExactlyOnceWith('test', 'userName');
  });

  it(`should call disable`, () => {
    store.disable('test');

    expect(dispatcher.disable).toHaveBeenCalledExactlyOnceWith('test');
  });

  it(`should call enable`, () => {
    store.enable('test');

    expect(dispatcher.enable).toHaveBeenCalledExactlyOnceWith('test');
  });

  it(`should call focus`, () => {
    store.focus('test');

    expect(dispatcher.focus).toHaveBeenCalledExactlyOnceWith('test');
  });

  it(`should call markAsDirty`, () => {
    store.markAsDirty('test');

    expect(dispatcher.markAsDirty).toHaveBeenCalledExactlyOnceWith('test');
  });

  it(`should call markAsPristine`, () => {
    store.markAsPristine('test');

    expect(dispatcher.markAsPristine).toHaveBeenCalledExactlyOnceWith('test');
  });

  it(`should call markAsSubmitted`, () => {
    store.markAsSubmitted('test');

    expect(dispatcher.markAsSubmitted).toHaveBeenCalledExactlyOnceWith('test');
  });

  it(`should call markAsTouched`, () => {
    store.markAsTouched('test');

    expect(dispatcher.markAsTouched).toHaveBeenCalledExactlyOnceWith('test');
  });

  it(`should call markAsUnsubmitted`, () => {
    store.markAsUnsubmitted('test');

    expect(dispatcher.markAsUnsubmitted).toHaveBeenCalledExactlyOnceWith('test');
  });

  it(`should call markAsUntouched`, () => {
    store.markAsUntouched('test');

    expect(dispatcher.markAsUntouched).toHaveBeenCalledExactlyOnceWith('test');
  });

  it(`should call moveArrayControl`, () => {
    store.moveArrayControl('test', 3, 1);

    expect(dispatcher.moveArrayControl).toHaveBeenCalledExactlyOnceWith('test', 3, 1);
  });

  it(`should call removeArrayControl`, () => {
    store.removeArrayControl('test', 2);

    expect(dispatcher.removeArrayControl).toHaveBeenCalledExactlyOnceWith('test', 2);
  });

  it(`should call removeGroupControl`, () => {
    store.removeGroupControl('test', 'userName');

    expect(dispatcher.removeGroupControl).toHaveBeenCalledExactlyOnceWith('test', 'userName');
  });

  it(`should call reset`, () => {
    store.reset('test');

    expect(dispatcher.reset).toHaveBeenCalledExactlyOnceWith('test');
  });

  it(`should call setAsyncError`, () => {
    store.setAsyncError('test', 'userName', { required: true });

    expect(dispatcher.setAsyncError).toHaveBeenCalledExactlyOnceWith('test', 'userName', { required: true });
  });

  it(`should call setErrors`, () => {
    store.setErrors('test.userName', { required: { actual: null } });

    expect(dispatcher.setErrors).toHaveBeenCalledExactlyOnceWith('test.userName', { required: { actual: null } });
  });

  it(`should call setUserDefinedProperty`, () => {
    store.setUserDefinedProperty('test.userName', '_previous', 'max');

    expect(dispatcher.setUserDefinedProperty).toHaveBeenCalledExactlyOnceWith('test.userName', '_previous', 'max');
  });

  it(`should call setValue`, () => {
    store.setValue('test', 'hello world');

    expect(dispatcher.setValue).toHaveBeenCalledExactlyOnceWith('test', 'hello world');
  });

  it(`should call startAsyncValidation`, () => {
    store.startAsyncValidation('test.userName', 'unique');

    expect(dispatcher.startAsyncValidation).toHaveBeenCalledExactlyOnceWith('test.userName', 'unique');
  });

  it(`should call swapArrayControl`, () => {
    store.swapArrayControl('test.skills', 4, 6);

    expect(dispatcher.swapArrayControl).toHaveBeenCalledExactlyOnceWith('test.skills', 4, 6);
  });

  it(`should call unfocus`, () => {
    store.unfocus('test');

    expect(dispatcher.unfocus).toHaveBeenCalledExactlyOnceWith('test');
  });
});
