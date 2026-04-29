import {
  Actions,
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
} from '../actions';
import { NgrxFormControlId, ValidationErrors } from '../state';
import { FormActionDispatcher } from './form-action-dispatcher';

export abstract class BaseFormActionDispatcher<TValue = any> implements FormActionDispatcher<TValue> {
  /**
   * Dispatch the specified form action.
   * @param {Actions} action Form action to dispatch.
   */
  protected abstract dispatch(action: Actions<any>): void;

  /**
   * @inheritdoc
   */
  public addArrayControl(controlId: NgrxFormControlId, value: TValue, index?: number): void {
    const action = new AddArrayControlAction(controlId, value, index);
    this.dispatch(action);
  }

  /**
   * @inheritdoc
   */
  public addGroupControl(controlId: NgrxFormControlId, name: string, value: any): void {
    const action = new AddGroupControlAction(controlId, name, value);
    this.dispatch(action);
  }

  /**
   * @inheritdoc
   */
  public clearAsyncError(controlId: NgrxFormControlId, name: string): void {
    const action = new ClearAsyncErrorAction(controlId, name);
    this.dispatch(action);
  }

  /**
   * @inheritdoc
   */
  public disable(controlId: NgrxFormControlId): void {
    const action = new DisableAction(controlId);
    this.dispatch(action);
  }

  /**
   * @inheritdoc
   */
  public enable(controlId: NgrxFormControlId): void {
    const action = new EnableAction(controlId);
    this.dispatch(action);
  }

  /**
   * @inheritdoc
   */
  public focus(controlId: NgrxFormControlId): void {
    const action = new FocusAction(controlId);
    this.dispatch(action);
  }

  /**
   * @inheritdoc
   */
  public markAsDirty(controlId: NgrxFormControlId): void {
    const action = new MarkAsDirtyAction(controlId);
    this.dispatch(action);
  }

  /**
   * @inheritdoc
   */
  public markAsPristine(controlId: NgrxFormControlId): void {
    const action = new MarkAsPristineAction(controlId);
    this.dispatch(action);
  }

  /**
   * @inheritdoc
   */
  public markAsSubmitted(controlId: NgrxFormControlId): void {
    const action = new MarkAsSubmittedAction(controlId);
    this.dispatch(action);
  }

  /**
   * @inheritdoc
   */
  public markAsTouched(controlId: NgrxFormControlId): void {
    const action = new MarkAsTouchedAction(controlId);
    this.dispatch(action);
  }

  /**
   * @inheritdoc
   */
  public markAsUnsubmitted(controlId: NgrxFormControlId): void {
    const action = new MarkAsUnsubmittedAction(controlId);
    this.dispatch(action);
  }

  /**
   * @inheritdoc
   */
  public markAsUntouched(controlId: NgrxFormControlId): void {
    const action = new MarkAsUntouchedAction(controlId);
    this.dispatch(action);
  }

  /**
   * @inheritdoc
   */
  public moveArrayControl(controlId: NgrxFormControlId, fromIndex: number, toIndex: number): void {
    const action = new MoveArrayControlAction(controlId, fromIndex, toIndex);
    this.dispatch(action);
  }

  /**
   * @inheritdoc
   */
  public removeArrayControl(controlId: NgrxFormControlId, index: number): void {
    const action = new RemoveArrayControlAction(controlId, index);
    this.dispatch(action);
  }

  /**
   * @inheritdoc
   */
  public removeGroupControl<Value>(controlId: NgrxFormControlId, name: string & keyof Value): void {
    const action = new RemoveGroupControlAction<Value>(controlId, name);
    this.dispatch(action);
  }

  /**
   * @inheritdoc
   */
  public reset(controlId: NgrxFormControlId): void {
    const action = new ResetAction(controlId);
    this.dispatch(action);
  }

  /**
   * @inheritdoc
   */
  public setAsyncError(controlId: NgrxFormControlId, name: string, value: any): void {
    const action = new SetAsyncErrorAction(controlId, name, value);
    this.dispatch(action);
  }

  /**
   * @inheritdoc
   */
  public setErrors(controlId: NgrxFormControlId, errors: ValidationErrors): void {
    const action = new SetErrorsAction(controlId, errors);
    this.dispatch(action);
  }

  /**
   * @inheritdoc
   */
  public setUserDefinedProperty<T = any>(controlId: NgrxFormControlId, name: string, value: T): void {
    const action = new SetUserDefinedPropertyAction(controlId, name, value);
    this.dispatch(action);
  }

  /**
   * @inheritdoc
   */
  public setValue(controlId: NgrxFormControlId, value: any): void {
    const action = new SetValueAction(controlId, value);
    this.dispatch(action);
  }

  /**
   * @inheritdoc
   */
  public startAsyncValidation(controlId: NgrxFormControlId, name: string): void {
    const action = new StartAsyncValidationAction(controlId, name);
    this.dispatch(action);
  }

  /**
   * @inheritdoc
   */
  public swapArrayControl(controlId: NgrxFormControlId, fromIndex: number, toIndex: number): void {
    const action = new SwapArrayControlAction(controlId, fromIndex, toIndex);
    this.dispatch(action);
  }

  /**
   * @inheritdoc
   */
  public unfocus(controlId: NgrxFormControlId): void {
    const action = new UnfocusAction(controlId);
    this.dispatch(action);
  }
}
