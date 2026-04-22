import { Actions, MarkAsDirtyAction, MarkAsPristineAction, MarkAsTouchedAction, MarkAsUntouchedAction, ResetAction, SetValueAction } from '../actions';
import { NgrxFormControlId } from '../state';
import { FormActionDispatcher } from './form-action-dispatcher';

export abstract class BaseFormActionDispatcher<TValue = any> implements FormActionDispatcher<TValue> {
  /**
   * Dispatch the specified form action.
   * @param {Actions} action Form action to dispatch.
   */
  protected abstract dispatch(action: Actions<TValue>): void;

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
  public markAsTouched(controlId: NgrxFormControlId): void {
    const action = new MarkAsTouchedAction(controlId);
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
  public reset(controlId: NgrxFormControlId): void {
    const action = new ResetAction(controlId);
    this.dispatch(action);
  }

  /**
   * @inheritdoc
   */
  public setValue(controlId: NgrxFormControlId, value: any): void {
    const action = new SetValueAction(controlId, value);
    this.dispatch(action);
  }
}
