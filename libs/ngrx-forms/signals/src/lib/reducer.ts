import { signalStoreFeature, SignalStoreFeature } from '@ngrx/signals';
import { EventCreator, on, withReducer } from '@ngrx/signals/events';
import { Action, ActionReducer } from '@ngrx/store';
import {
  AbstractControlState,
  Actions,
  AddArrayControlAction,
  AddGroupControlAction,
  ClearAsyncErrorAction,
  DisableAction,
  EnableAction,
  FocusAction,
  FormState,
  formStateReducer,
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
} from 'ngrx-form-state';
import { FormConfig, FormConfigFn } from './config';
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
} from './events';
import { getConfig } from './helpers';
import { SignalFormState } from './types';

/**
 * Provides the form reducer to the signal store.
 * @returns
 */
export function withFormReducer<Value, Name extends string = string>(...configFnArray: FormConfigFn<Value, Name>[]): SignalStoreFeature {
  const config = getConfig(configFnArray);
  const { on } = createReducer(config);

  return signalStoreFeature(
    withReducer(
      on(addArrayControl, ({ controlId, value, index }) => new AddArrayControlAction(controlId, value, index)),
      on(addGroupControl, ({ controlId, name, value }) => new AddGroupControlAction(controlId, name, value)),
      on(clearAsyncError, ({ controlId, name }) => new ClearAsyncErrorAction(controlId, name)),
      on(disable, ({ controlId }) => new DisableAction(controlId)),
      on(enable, ({ controlId }) => new EnableAction(controlId)),
      on(focus, ({ controlId }) => new FocusAction(controlId)),
      on(markAsDirty, ({ controlId }) => new MarkAsDirtyAction(controlId)),
      on(markAsPristine, ({ controlId }) => new MarkAsPristineAction(controlId)),
      on(markAsSubmitted, ({ controlId }) => new MarkAsSubmittedAction(controlId)),
      on(markAsTouched, ({ controlId }) => new MarkAsTouchedAction(controlId)),
      on(markAsUnsubmitted, ({ controlId }) => new MarkAsUnsubmittedAction(controlId)),
      on(markAsUntouched, ({ controlId }) => new MarkAsUntouchedAction(controlId)),
      on(moveArrayControl, ({ controlId, fromIndex, toIndex }) => new MoveArrayControlAction(controlId, fromIndex, toIndex)),
      on(removeArrayControl, ({ controlId, index }) => new RemoveArrayControlAction(controlId, index)),
      on(removeGroupControl, ({ controlId, name }) => new RemoveGroupControlAction(controlId, name)),
      on(reset, ({ controlId }) => new ResetAction(controlId)),
      on(setAsyncError, ({ controlId, name, value }) => new SetAsyncErrorAction(controlId, name, value)),
      on(setErrors, ({ controlId, errors }) => new SetErrorsAction(controlId, errors)),
      on(setUserDefinedProperty, ({ controlId, name, value }) => new SetUserDefinedPropertyAction(controlId, name, value)),
      on(setValue, ({ controlId, value }) => new SetValueAction(controlId, value)),
      on(startAsyncValidation, ({ controlId, name }) => new StartAsyncValidationAction(controlId, name)),
      on(swapArrayControl, ({ controlId, fromIndex, toIndex }) => new SwapArrayControlAction(controlId, fromIndex, toIndex)),
      on(unfocus, ({ controlId }) => new UnfocusAction(controlId)),
    ),
  );
}

/**
 * Returns a function to create a case reducer that can be used with `withReducer`.
 * @param {FormConfig<Value>} config Configuration object.
 */
function createReducer<Value>(config: FormConfig<Value>) {
  const reducer = createFormReducer(config);

  return {
    on: <Payload, Type extends string>(event: EventCreator<Type, Payload>, creator: (payload: Payload) => Actions<any>) => {
      return on(event, ({ payload }) => {
        const action = creator(payload);
        return (state: SignalFormState<Value, string>) => {
          const newState = reducer(state[config.name], action);
          if (state[config.name] === newState) {
            return {};
          }

          return { [config.name]: newState };
        };
      });
    },
  };
}

/**
 * Creates a form reducer function.
 * @param {FormConfig<Value>} config Configuration object.
 */
function createFormReducer<Value>(config: FormConfig<Value>): ActionReducer<FormState<Value>> {
  return (state: FormState<Value> | undefined, action: Action): FormState<Value> => {
    let newState = formStateReducer(state as AbstractControlState<Value>, action);
    if (state !== newState) {
      newState = config.stateChangeFnArray.reduce((s, f) => f(s), newState);
    }

    return config.updateFnArray.reduce((s, f) => f(s), newState);
  };
}
