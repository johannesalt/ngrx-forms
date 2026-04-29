import { type } from '@ngrx/signals';
import { event } from '@ngrx/signals/events';
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
  NgrxFormControlId,
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
  ValidationErrors,
} from 'ngrx-form-state';

/**
 * Adds a child control at the given index or at the end of a form array state.
 */
export const addArrayControl = event(AddArrayControlAction.TYPE, type<{ controlId: NgrxFormControlId; value: any; index?: number }>());

/**
 * Adds a child control with the given name and value to a form group state.
 */
export const addGroupControl = event(AddGroupControlAction.TYPE, type<{ controlId: NgrxFormControlId; name: string; value: any }>());

/**
 * Clears the async error with the given name.
 */
export const clearAsyncError = event(ClearAsyncErrorAction.TYPE, type<{ controlId: NgrxFormControlId; name: string }>());

/**
 * Disables the control.
 */
export const disable = event(DisableAction.TYPE, type<{ controlId: NgrxFormControlId }>());

/**
 * Enables the control.
 */
export const enable = event(EnableAction.TYPE, type<{ controlId: NgrxFormControlId }>());

/**
 * Sets the focus status of the field to `true`.
 */
export const focus = event(FocusAction.TYPE, type<{ controlId: NgrxFormControlId }>());

/**
 * Sets the dirty status of the field to `true`.
 */
export const markAsDirty = event(MarkAsDirtyAction.TYPE, type<{ controlId: NgrxFormControlId }>());

/**
 * Sets the dirty status of the field to `false`.
 */
export const markAsPristine = event(MarkAsPristineAction.TYPE, type<{ controlId: NgrxFormControlId }>());

/**
 * Sets the submitted status of the field to `true`.
 */
export const markAsSubmitted = event(MarkAsSubmittedAction.TYPE, type<{ controlId: NgrxFormControlId }>());

/**
 * Sets the touched status of the field to `true`.
 */
export const markAsTouched = event(MarkAsTouchedAction.TYPE, type<{ controlId: NgrxFormControlId }>());

/**
 * Sets the submitted status of the field to `false`.
 */
export const markAsUnsubmitted = event(MarkAsUnsubmittedAction.TYPE, type<{ controlId: NgrxFormControlId }>());

/**
 * Sets the touched status of the field to `false`.
 */
export const markAsUntouched = event(MarkAsUntouchedAction.TYPE, type<{ controlId: NgrxFormControlId }>());

/**
 * Moves the cild control at the source index to the destination index.
 */
export const moveArrayControl = event(MoveArrayControlAction.TYPE, type<{ controlId: NgrxFormControlId; fromIndex: number; toIndex: number }>());

/**
 * Removes the child control at the given index.
 */
export const removeArrayControl = event(RemoveArrayControlAction.TYPE, type<{ controlId: NgrxFormControlId; index: number }>());

/**
 * Removes the child control with the given name.
 */
export const removeGroupControl = event(RemoveGroupControlAction.TYPE, type<{ controlId: NgrxFormControlId; name: string }>());

/**
 * Resets the touched and dirty state of the field and its descendants.
 */
export const reset = event(ResetAction.TYPE, type<{ controlId: NgrxFormControlId }>());

/**
 * Sets the async error for the given name to the given value.
 */
export const setAsyncError = event(SetAsyncErrorAction.TYPE, type<{ controlId: NgrxFormControlId; name: string; value: any }>());

/**
 * Sets the errors of the form state.
 */
export const setErrors = event(SetErrorsAction.TYPE, type<{ controlId: NgrxFormControlId; errors: ValidationErrors }>());

/**
 * Sets a user-defined property on a form state.
 */
export const setUserDefinedProperty = event(SetUserDefinedPropertyAction.TYPE, type<{ controlId: NgrxFormControlId; name: string; value: any }>());

/**
 * Sets the control value.
 */
export const setValue = event(SetValueAction.TYPE, type<{ controlId: NgrxFormControlId; value: any }>());

/**
 * Marks the async validation for the given name as pending.
 */
export const startAsyncValidation = event(StartAsyncValidationAction.TYPE, type<{ controlId: NgrxFormControlId; name: string }>());

/**
 * Swaps the child controls at those indices.
 */
export const swapArrayControl = event(SwapArrayControlAction.TYPE, type<{ controlId: NgrxFormControlId; fromIndex: number; toIndex: number }>());

/**
 * Sets the focus status of the field to `false`.
 */
export const unfocus = event(UnfocusAction.TYPE, type<{ controlId: NgrxFormControlId }>());
