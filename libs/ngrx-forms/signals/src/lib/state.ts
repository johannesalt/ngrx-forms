import { EmptyFeatureResult, signalStoreFeature, SignalStoreFeature, withState } from '@ngrx/signals';
import { createFormArrayState, createFormControlState, createFormGroupState, FormState, isBoxed, NgrxFormControlId } from 'ngrx-form-state';
import { FormConfigFn } from './config';
import { getConfig } from './helpers';
import { SignalFormState } from './types';

/**
 * Provides the form state to the signal store.
 * @param {NgrxFormControlId} controlId Id of the control.
 * @param {Value} initialValue Initial value.
 * @param {FormConfigFn<Value>[]} configFnArray Functions to configure the form.
 */
export function withFormState<Value, Name extends string = 'form'>(
  controlId: NgrxFormControlId,
  initialValue: Value,
  ...configFnArray: FormConfigFn<Value, Name>[]
): SignalStoreFeature<
  EmptyFeatureResult,
  {
    methods: Record<string, any>;
    props: object;
    state: SignalFormState<Value, Name>;
  }
>;

/**
 * Provides the form state to the signal store.
 * @param {NgrxFormControlId} controlId Id of the control.
 * @param {Value} initialValue Initial value.
 * @param {FormConfigFn<Value>[]} configFnArray Functions to configure the form.
 */
export function withFormState<Value, Name extends string>(
  controlId: NgrxFormControlId,
  initialValue: Value,
  ...configFnArray: FormConfigFn<Value, Name>[]
): SignalStoreFeature {
  const config = getConfig(configFnArray);
  return signalStoreFeature(withState({ [config.name]: createFormState(controlId, initialValue) }));
}

/**
 * Creates a form control state with an ID and a value.
 * @param {string} id The ID of the form control state.
 * @param {Value} value Initial form control value.
 * @returns {FormState<Value>} Form control state with an ID and a value.
 */
function createFormState<Value>(id: string, value: Value): FormState<Value> {
  if (isBoxed(value)) {
    return createFormControlState<any>(id, value) as FormState<Value>;
  }

  if (value !== null && Array.isArray(value)) {
    return createFormArrayState(id, value) as FormState<Value>;
  }

  if (value !== null && typeof value === 'object') {
    return createFormGroupState(id, value) as FormState<Value>;
  }

  return createFormControlState<any>(id, value) as FormState<Value>;
}
