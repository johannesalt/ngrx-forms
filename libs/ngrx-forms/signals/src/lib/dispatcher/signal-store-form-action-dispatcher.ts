import { inject, Injectable } from '@angular/core';
import { Dispatcher, EventInstance } from '@ngrx/signals/events';
import { FormActionDispatcher, NgrxFormControlId, ValidationErrors } from 'ngrx-form-state';
import {
  addArrayControl,
  addGroupControl,
  clearAsyncError,
  disable,
  enable,
  focus,
  markAsDirty,
  markAsPristine,
  markAsSubmitted,
  markAsTouched,
  markAsUnsubmitted,
  markAsUntouched,
  moveArrayControl,
  removeArrayControl,
  removeGroupControl,
  reset,
  setAsyncError,
  setErrors,
  setUserDefinedProperty,
  setValue,
  startAsyncValidation,
  swapArrayControl,
  unfocus,
} from '../events';

@Injectable({ providedIn: 'root' })
export class SignalStoreFormActionDispatcher implements FormActionDispatcher {
  private readonly dispatcher = inject(Dispatcher);

  /**
   * @inheritdoc
   */
  public addArrayControl(controlId: NgrxFormControlId, value: any, index?: number): void {
    this.dispatch(addArrayControl({ controlId, value, index }));
  }

  /**
   * @inheritdoc
   */
  public addGroupControl(controlId: NgrxFormControlId, name: string, value: any): void {
    this.dispatch(addGroupControl({ controlId, name, value }));
  }

  /**
   * @inheritdoc
   */
  public clearAsyncError(controlId: NgrxFormControlId, name: string): void {
    this.dispatch(clearAsyncError({ controlId, name }));
  }

  /**
   * @inheritdoc
   */
  public disable(controlId: NgrxFormControlId): void {
    this.dispatch(disable({ controlId }));
  }

  /**
   * @inheritdoc
   */
  public enable(controlId: NgrxFormControlId): void {
    this.dispatch(enable({ controlId }));
  }

  /**
   * @inheritdoc
   */
  public focus(controlId: NgrxFormControlId): void {
    this.dispatch(focus({ controlId }));
  }

  /**
   * @inheritdoc
   */
  public markAsDirty(controlId: NgrxFormControlId): void {
    this.dispatch(markAsDirty({ controlId }));
  }

  /**
   * @inheritdoc
   */
  public markAsPristine(controlId: NgrxFormControlId): void {
    this.dispatch(markAsPristine({ controlId }));
  }

  /**
   * @inheritdoc
   */
  public markAsSubmitted(controlId: NgrxFormControlId): void {
    this.dispatch(markAsSubmitted({ controlId }));
  }

  /**
   * @inheritdoc
   */
  public markAsTouched(controlId: NgrxFormControlId): void {
    this.dispatch(markAsTouched({ controlId }));
  }

  /**
   * @inheritdoc
   */
  public markAsUnsubmitted(controlId: NgrxFormControlId): void {
    this.dispatch(markAsUnsubmitted({ controlId }));
  }

  /**
   * @inheritdoc
   */
  public markAsUntouched(controlId: NgrxFormControlId): void {
    this.dispatch(markAsUntouched({ controlId }));
  }

  /**
   * @inheritdoc
   */
  public moveArrayControl(controlId: NgrxFormControlId, fromIndex: number, toIndex: number): void {
    this.dispatch(moveArrayControl({ controlId, fromIndex, toIndex }));
  }

  /**
   * @inheritdoc
   */
  public removeArrayControl(controlId: NgrxFormControlId, index: number): void {
    this.dispatch(removeArrayControl({ controlId, index }));
  }

  /**
   * @inheritdoc
   */
  public removeGroupControl<Value>(controlId: NgrxFormControlId, name: string & keyof Value): void {
    this.dispatch(removeGroupControl({ controlId, name }));
  }

  /**
   * @inheritdoc
   */
  public reset(controlId: NgrxFormControlId): void {
    this.dispatch(reset({ controlId }));
  }

  /**
   * @inheritdoc
   */
  public setAsyncError(controlId: NgrxFormControlId, name: string, value: any): void {
    this.dispatch(setAsyncError({ controlId, name, value }));
  }

  /**
   * @inheritdoc
   */
  public setErrors(controlId: NgrxFormControlId, errors: ValidationErrors): void {
    this.dispatch(setErrors({ controlId, errors }));
  }

  /**
   * @inheritdoc
   */
  public setUserDefinedProperty<T = any>(controlId: NgrxFormControlId, name: string, value: T): void {
    this.dispatch(setUserDefinedProperty({ controlId, name, value }));
  }

  /**
   * @inheritdoc
   */
  public setValue<TValue>(controlId: NgrxFormControlId, value: TValue): void {
    this.dispatch(setValue({ controlId, value }));
  }

  /**
   * @inheritdoc
   */
  public startAsyncValidation(controlId: NgrxFormControlId, name: string): void {
    this.dispatch(startAsyncValidation({ controlId, name }));
  }

  /**
   * @inheritdoc
   */
  public swapArrayControl(controlId: NgrxFormControlId, fromIndex: number, toIndex: number): void {
    this.dispatch(swapArrayControl({ controlId, fromIndex, toIndex }));
  }

  /**
   * @inheritdoc
   */
  public unfocus(controlId: NgrxFormControlId): void {
    this.dispatch(unfocus({ controlId }));
  }

  /**
   * Dispatch the specified form event.
   * @param {EventInstance<Type, any>} event Form event to dispatch.
   */
  protected dispatch<Type extends string>(event: EventInstance<Type, any>): void {
    this.dispatcher.dispatch(event);
  }
}
