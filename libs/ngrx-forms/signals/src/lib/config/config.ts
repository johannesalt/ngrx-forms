import { FormState, ProjectFn } from 'ngrx-form-state';

export interface FormConfig<Value, Name = string> {
  /**
   * The name under which the form's state is stored in (Redux) state.
   */
  name: Name;

  /**
   * Update functions that will be invoked only when the form's state has changed.
   */
  stateChangeFnArray: ProjectFn<FormState<Value>>[];

  /**
   * Update function that will always invoked.
   */
  updateFnArray: ProjectFn<FormState<Value>>[];
}
