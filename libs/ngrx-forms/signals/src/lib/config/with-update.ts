import { FormState, ProjectFn } from 'ngrx-form-state';
import { FormConfigFn } from './types';

/**
 * Registers an update function that always will be invoked (regardless if the form's state has changed).
 * Multiple reistered update functions will be applied in order they were provided.
 * @param updateFn Function to add.
 */
export function withUpdate<Value, Name extends string = string>(updateFn: ProjectFn<FormState<Value>>): FormConfigFn<Value, Name> {
  return (config) => ({ ...config, updateFnArray: [...config.updateFnArray, updateFn] });
}
