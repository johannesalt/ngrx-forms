import { FormState, ProjectFn } from 'ngrx-form-state';
import { FormConfigFn } from './types';

/**
 * Registers an update function that will be invoked only when the form's state has changed.
 * Multiple registered update functions will be applied in order they were provided.
 * @param stateChangeFn Function to add.
 */
export function withOnStateChange<Value, Name extends string = string>(stateChangeFn: ProjectFn<FormState<Value>>): FormConfigFn<Value, Name> {
  return (config) => ({ ...config, stateChangeFnArray: [...config.stateChangeFnArray, stateChangeFn] });
}
