import { InjectionToken } from '@angular/core';
import { NgrxFormControlId, ValidationErrors } from '../state';

export const NGRX_FORM_ACTION_DISPATCHER = new InjectionToken<FormActionDispatcher>('NGRX_FORM_ACTION_DISPATCHER');

export interface FormActionDispatcher<TValue = any> {
  /**
   * Adds a child control at the given index or at the end of a form array state.
   * @param {NgrxFormControlId} controlId Id of the control.
   * @param {TValue} value Value to add.
   * @param {number} index If not null, insert child control at the given index; otherwise at the end.
   */
  addArrayControl(controlId: NgrxFormControlId, value: TValue, index?: number): void;

  /**
   * Adds a child control with the given name and value to a form group state.
   * @param {NgrxFormControlId} controlId Id of the control.
   * @param {string} name Name of the child control.
   * @param {any} value Intial value.
   */
  addGroupControl(controlId: NgrxFormControlId, name: string, value: any): void;

  /**
   * Clears the async error with the given name.
   * @param {NgrxFormControlId} controlId Id of the control.
   * @param {string} name Name of the error to remove.
   */
  clearAsyncError(controlId: NgrxFormControlId, name: string): void;

  /**
   * Disables the control.
   * @param {NgrxFormControlId} controlId Id of the control.
   */
  disable(controlId: NgrxFormControlId): void;

  /**
   * Enables the control.
   * @param {NgrxFormControlId} controlId Id of the control.
   */
  enable(controlId: NgrxFormControlId): void;

  /**
   * Sets the focus status of the field to `true`.
   * @param {NgrxFormControlId} controlId Id of the control.
   */
  focus(controlId: NgrxFormControlId): void;

  /**
   * Sets the dirty status of the field to `true`.
   * @param {NgrxFormControlId} controlId Id of the control.
   */
  markAsDirty(controlId: NgrxFormControlId): void;

  /**
   * Sets the dirty status of the field to `false`.
   * @param {NgrxFormControlId} controlId Id of the control.
   */
  markAsPristine(controlId: NgrxFormControlId): void;

  /**
   * Sets the submitted status of the field to `true`.
   * @param {NgrxFormControlId} controlId Id of the control.
   */
  markAsSubmitted(controlId: NgrxFormControlId): void;

  /**
   * Sets the touched status of the field to `true`.
   * @param {NgrxFormControlId} controlId Id of the control.
   */
  markAsTouched(controlId: NgrxFormControlId): void;

  /**
   * Sets the submitted status of the field to `false`.
   * @param {NgrxFormControlId} controlId Id of the control.
   */
  markAsUnsubmitted(controlId: NgrxFormControlId): void;

  /**
   * Sets the touched status of the field to `false`.
   * @param {NgrxFormControlId} controlId Id of the control.
   */
  markAsUntouched(controlId: NgrxFormControlId): void;

  /**
   * Move the array control.
   * @param {NgrxFormControlId} controlId Id of the control.
   * @param {number} fromIndex Index of the control to move.
   * @param {number} toIndex Destination index of the control..
   */
  moveArrayControl(controlId: NgrxFormControlId, fromIndex: number, toIndex: number): void;

  /**
   * Remove the array control at the given index.
   * @param {NgrxFormControlId} controlId Id of the control.
   * @param {number} index Index of the control to remove.
   */
  removeArrayControl(controlId: NgrxFormControlId, index: number): void;

  /**
   * Remove the group control with the given name.
   * @param {NgrxFormControlId} controlId Id of the control.
   * @param {keyof Value} name Name of the control to remove.
   */
  removeGroupControl<Value>(controlId: NgrxFormControlId, name: string & keyof Value): void;

  /**
   * Resets the {@link touched} and {@link dirty} state of the field and its descendants.
   * @param {NgrxFormControlId} controlId Id of the control.
   */
  reset(controlId: NgrxFormControlId): void;

  /**
   * Marks the async validation for the given name as pending.
   * @param {NgrxFormControlId} controlId Id of the control.
   * @param {string} name Name of the async validation.
   */
  startAsyncValidation(controlId: NgrxFormControlId, name: string): void;

  /**
   * Sets the async error for the given name to the given value.
   * @param {NgrxFormControlId} controlId Id of the control.
   * @param {string} name Name of the async error.
   * @param {any} value Error value.
   */
  setAsyncError(controlId: NgrxFormControlId, name: string, value: any): void;

  /**
   * Sets the errors of the form state.
   * @param {NgrxFormControlId} controlId Id of the control.
   * @param {ValidationErrors} errors Validation errors.
   */
  setErrors(controlId: NgrxFormControlId, errors: ValidationErrors): void;

  /**
   * Sets a user-defined property on a form state.
   * @param {NgrxFormControlId} controlId Id of the control.
   * @param {string} name Name of the user-defined property.
   * @param {T} value Value of the property.
   */
  setUserDefinedProperty<T = any>(controlId: NgrxFormControlId, name: string, value: T): void;

  /**
   * Sets the control value.
   * @param {NgrxFormControlId} controlId Id of the control.
   * @param {TValue} value New value.
   */
  setValue(controlId: NgrxFormControlId, value: TValue): void;

  /**
   * Swap the child controls at those indices in a form array state.
   * @param {NgrxFormControlId} controlId  Id of the control.
   * @param {number} fromIndex
   * @param {number} toIndex
   */
  swapArrayControl(controlId: NgrxFormControlId, fromIndex: number, toIndex: number): void;

  /**
   * Sets the focus status of the field to `false`.
   * @param {NgrxFormControlId} controlId Id of the control.
   */
  unfocus(controlId: NgrxFormControlId): void;
}
