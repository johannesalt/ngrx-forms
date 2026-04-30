import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import {
  AddArrayControlAction,
  AddGroupControlAction,
  ClearAsyncErrorAction,
  DisableAction,
  EnableAction,
  FocusAction,
  MarkAsDirtyAction,
  MarkAsPristineAction,
  MarkAsSubmittedAction,
  MarkAsTouchedAction,
  MarkAsUnsubmittedAction,
  MarkAsUntouchedAction,
  MoveArrayControlAction,
  RemoveArrayControlAction,
  RemoveGroupControlAction,
  ResetAction,
  SetAsyncErrorAction,
  SetErrorsAction,
  SetUserDefinedPropertyAction,
  SetValueAction,
  StartAsyncValidationAction,
  SwapArrayControlAction,
  UnfocusAction,
} from '../actions';
import { NgrxFormActionDispatcher } from './ngrx-form-action-dispatcher';

describe(NgrxFormActionDispatcher.name, () => {
  let formActionDispatcher: NgrxFormActionDispatcher;

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
    formActionDispatcher = TestBed.inject(NgrxFormActionDispatcher);
  });

  it(`should dispatch ${AddArrayControlAction.TYPE} to the global store`, () => {
    formActionDispatcher.addArrayControl('test', 1);

    expect(store.dispatch).toHaveBeenCalledExactlyOnceWith(new AddArrayControlAction('test', 1));
  });

  it(`should dispatch ${AddGroupControlAction.TYPE} to the global store`, () => {
    formActionDispatcher.addGroupControl('test', 'userName', 'max.mustermann');

    expect(store.dispatch).toHaveBeenCalledExactlyOnceWith(new AddGroupControlAction('test', 'userName', 'max.mustermann'));
  });

  it(`should dispatch ${ClearAsyncErrorAction.TYPE} to the global store`, () => {
    formActionDispatcher.clearAsyncError('test', 'userName');

    expect(store.dispatch).toHaveBeenCalledExactlyOnceWith(new ClearAsyncErrorAction('test', 'userName'));
  });

  it(`should dispatch ${DisableAction.TYPE} to the global store`, () => {
    formActionDispatcher.disable('test');

    expect(store.dispatch).toHaveBeenCalledExactlyOnceWith(new DisableAction('test'));
  });

  it(`should dispatch ${EnableAction.TYPE} to the global store`, () => {
    formActionDispatcher.enable('test');

    expect(store.dispatch).toHaveBeenCalledExactlyOnceWith(new EnableAction('test'));
  });

  it(`should dispatch ${FocusAction.TYPE} to the global store`, () => {
    formActionDispatcher.focus('test');

    expect(store.dispatch).toHaveBeenCalledExactlyOnceWith(new FocusAction('test'));
  });

  it(`should dispatch ${MarkAsDirtyAction.TYPE} to the global store`, () => {
    formActionDispatcher.markAsDirty('test');

    expect(store.dispatch).toHaveBeenCalledExactlyOnceWith(new MarkAsDirtyAction('test'));
  });

  it(`should dispatch ${MarkAsPristineAction.TYPE} to the global store`, () => {
    formActionDispatcher.markAsPristine('test');

    expect(store.dispatch).toHaveBeenCalledExactlyOnceWith(new MarkAsPristineAction('test'));
  });

  it(`should dispatch ${MarkAsSubmittedAction.TYPE} to the global store`, () => {
    formActionDispatcher.markAsSubmitted('test');

    expect(store.dispatch).toHaveBeenCalledExactlyOnceWith(new MarkAsSubmittedAction('test'));
  });

  it(`should dispatch ${MarkAsTouchedAction.TYPE} to the global store`, () => {
    formActionDispatcher.markAsTouched('test');

    expect(store.dispatch).toHaveBeenCalledExactlyOnceWith(new MarkAsTouchedAction('test'));
  });

  it(`should dispatch ${MarkAsUnsubmittedAction.TYPE} to the global store`, () => {
    formActionDispatcher.markAsUnsubmitted('test');

    expect(store.dispatch).toHaveBeenCalledExactlyOnceWith(new MarkAsUnsubmittedAction('test'));
  });

  it(`should dispatch ${MarkAsUntouchedAction.TYPE} to the global store`, () => {
    formActionDispatcher.markAsUntouched('test');

    expect(store.dispatch).toHaveBeenCalledExactlyOnceWith(new MarkAsUntouchedAction('test'));
  });

  it(`should dispatch ${MoveArrayControlAction.TYPE} to the global store`, () => {
    formActionDispatcher.moveArrayControl('test', 3, 1);

    expect(store.dispatch).toHaveBeenCalledExactlyOnceWith(new MoveArrayControlAction('test', 3, 1));
  });

  it(`should dispatch ${RemoveArrayControlAction.TYPE} to the global store`, () => {
    formActionDispatcher.removeArrayControl('test', 2);

    expect(store.dispatch).toHaveBeenCalledExactlyOnceWith(new RemoveArrayControlAction('test', 2));
  });

  it(`should dispatch ${RemoveGroupControlAction.TYPE} to the global store`, () => {
    formActionDispatcher.removeGroupControl('test', 'userName');

    expect(store.dispatch).toHaveBeenCalledExactlyOnceWith(new RemoveGroupControlAction('test', 'userName'));
  });

  it(`should dispatch ${ResetAction.TYPE} to the global store`, () => {
    formActionDispatcher.reset('test');

    expect(store.dispatch).toHaveBeenCalledExactlyOnceWith(new ResetAction('test'));
  });

  it(`should dispatch ${SetAsyncErrorAction.TYPE} to the global store`, () => {
    formActionDispatcher.setAsyncError('test', 'userName', { required: true });

    expect(store.dispatch).toHaveBeenCalledExactlyOnceWith(new SetAsyncErrorAction('test', 'userName', { required: true }));
  });

  it(`should dispatch ${SetErrorsAction.TYPE} to the global store`, () => {
    formActionDispatcher.setErrors('test.userName', { required: { actual: null } });

    expect(store.dispatch).toHaveBeenCalledExactlyOnceWith(new SetErrorsAction('test.userName', { required: { actual: null } }));
  });

  it(`should dispatch ${SetUserDefinedPropertyAction.TYPE} to the global store`, () => {
    formActionDispatcher.setUserDefinedProperty('test.userName', '_previous', 'max');

    expect(store.dispatch).toHaveBeenCalledExactlyOnceWith(new SetUserDefinedPropertyAction('test.userName', '_previous', 'max'));
  });

  it(`should dispatch ${SetValueAction.TYPE} to the global store`, () => {
    formActionDispatcher.setValue('test', 'hello world');

    expect(store.dispatch).toHaveBeenCalledExactlyOnceWith(new SetValueAction('test', 'hello world'));
  });

  it(`should dispatch ${StartAsyncValidationAction.TYPE} to the global store`, () => {
    formActionDispatcher.startAsyncValidation('test.userName', 'unique');

    expect(store.dispatch).toHaveBeenCalledExactlyOnceWith(new StartAsyncValidationAction('test.userName', 'unique'));
  });

  it(`should dispatch ${SwapArrayControlAction.TYPE} to the global store`, () => {
    formActionDispatcher.swapArrayControl('test.skills', 4, 6);

    expect(store.dispatch).toHaveBeenCalledExactlyOnceWith(new SwapArrayControlAction('test.skills', 4, 6));
  });

  it(`should dispatch ${UnfocusAction.TYPE} to the global store`, () => {
    formActionDispatcher.unfocus('test');

    expect(store.dispatch).toHaveBeenCalledExactlyOnceWith(new UnfocusAction('test'));
  });
});
