import { Directive, output } from '@angular/core';
import { Actions } from '../actions';
import { NgrxFormControlDirective, NgrxFormControlValueType } from './directive';

@Directive({
  selector: '[ngrxFormControlState][ngrxFormsAction]',
})
export class NgrxLocalFormControlDirective<TStateValue, TViewValue = TStateValue> extends NgrxFormControlDirective<TStateValue, TViewValue> {
  public readonly ngrxFormsAction = output<Actions<NgrxFormControlValueType<TStateValue>>>();

  protected override dispatchAction(action: Actions<NgrxFormControlValueType<TStateValue>>) {
    this.ngrxFormsAction.emit(action);
  }
}
