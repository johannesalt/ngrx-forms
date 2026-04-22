import { InjectionToken } from '@angular/core';
import { NgrxFormControlId } from '../state';

export const NGRX_FORM_ACTION_DISPATCHER = new InjectionToken<FormActionDispatcher>('NGRX_FORM_ACTION_DISPATCHER');

export interface FormActionDispatcher<TValue = any> {
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
   * Sets the touched status of the field to `true`.
   * @param {NgrxFormControlId} controlId Id of the control.
   */
  markAsTouched(controlId: NgrxFormControlId): void;

  /**
   * Sets the touched status of the field to `false`.
   * @param {NgrxFormControlId} controlId Id of the control.
   */
  markAsUntouched(controlId: NgrxFormControlId): void;

  /**
   * Resets the {@link touched} and {@link dirty} state of the field and its descendants.
   * @param {NgrxFormControlId} controlId Id of the control.
   */
  reset(controlId: NgrxFormControlId): void;

  /**
   * Sets the control value.
   * @param {NgrxFormControlId} controlId Id of the control.
   * @param {TValue} value New value.
   */
  setValue(controlId: NgrxFormControlId, value: TValue): void;
}
