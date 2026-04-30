import { FormConfigFn } from './types';

/**
 * Configures the name under which the form's state is stored in the (NGRX) state.
 * @param {Name} name The name under which the form's state is stored.
 */
export function withName<Value, Name extends string>(name: Name): FormConfigFn<Value, Name> {
  return (config) => ({ ...config, name: name });
}
