import { EmptyFeatureResult, SignalStoreFeature, signalStoreFeature } from '@ngrx/signals';
import { NgrxFormControlId } from 'ngrx-form-state';
import { FormConfigFn } from './config';
import { withFormMethods } from './methods';
import { withFormReducer } from './reducer';
import { withFormState } from './state';
import { SignalFormMethods, SignalFormProps, SignalFormState } from './types';

/**
 * Provides the form ste capabilities to the signal store.
 * @param {NgrxFormControlId} controlId Id of the control.
 * @param {Value} initialValue Initial value.
 * @param {FormConfigFn<Value>[]} configFnArray Form configuration.
 */
export function withForm<Value, Key extends string = 'form'>(
  controlId: NgrxFormControlId,
  initialValue: Value,
  ...configFnArray: FormConfigFn<Value>[]
): SignalStoreFeature<
  EmptyFeatureResult,
  {
    state: SignalFormState<Value, Key>;
    props: SignalFormProps;
    methods: SignalFormMethods;
  }
>;

/**
 * Provides the form capabilities to the signal store.
 * @param {NgrxFormControlId} controlId Id of the control.
 * @param {Value} initialValue Initial value.
 * @param {FormConfigFn<Value>[]} configFnArray Form configuration.
 */
export function withForm<Value>(controlId: NgrxFormControlId, initialValue: Value, ...configFnArray: FormConfigFn<Value>[]): SignalStoreFeature {
  return signalStoreFeature(withFormMethods(), withFormReducer(...configFnArray), withFormState(controlId, initialValue, ...configFnArray));
}
