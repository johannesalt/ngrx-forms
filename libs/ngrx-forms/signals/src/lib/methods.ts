import { inject } from '@angular/core';
import { EmptyFeatureResult, signalStoreFeature, SignalStoreFeature, withMethods } from '@ngrx/signals';
import { FormActionDispatcher } from 'ngrx-form-state';
import { SignalStoreFormActionDispatcher } from './dispatcher/signal-store-form-action-dispatcher';
import { SignalFormMethods } from './types';

/**
 * Provides the form methods to the signal store.
 */
export function withFormMethods(): SignalStoreFeature<
  EmptyFeatureResult,
  {
    methods: SignalFormMethods;
    props: object;
    state: object;
  }
>;

/**
 * Provides the form methods to the signal store.
 */
export function withFormMethods(): SignalStoreFeature {
  return signalStoreFeature(
    withMethods((store, dispatcher = inject(SignalStoreFormActionDispatcher)) => {
      const methods: Record<keyof FormActionDispatcher, any> = {
        addArrayControl: dispatcher.addArrayControl,
        addGroupControl: dispatcher.addGroupControl,
        clearAsyncError: dispatcher.clearAsyncError,
        disable: dispatcher.disable,
        enable: dispatcher.enable,
        focus: dispatcher.focus,
        markAsDirty: dispatcher.markAsDirty,
        markAsPristine: dispatcher.markAsPristine,
        markAsSubmitted: dispatcher.markAsSubmitted,
        markAsTouched: dispatcher.markAsTouched,
        markAsUnsubmitted: dispatcher.markAsUnsubmitted,
        markAsUntouched: dispatcher.markAsUntouched,
        moveArrayControl: dispatcher.moveArrayControl,
        removeArrayControl: dispatcher.removeArrayControl,
        removeGroupControl: dispatcher.removeGroupControl,
        reset: dispatcher.reset,
        setAsyncError: dispatcher.setAsyncError,
        setErrors: dispatcher.setErrors,
        setUserDefinedProperty: dispatcher.setUserDefinedProperty,
        setValue: dispatcher.setValue,
        startAsyncValidation: dispatcher.startAsyncValidation,
        swapArrayControl: dispatcher.swapArrayControl,
        unfocus: dispatcher.unfocus,
      };

      return Object.entries(methods)
        .filter(([name]) => !Object.hasOwn(store, name))
        .reduce((result, [name, fn]) => ({ ...result, [name]: fn.bind(dispatcher) }), {});
    }),
  );
}
