import { Directive, output } from '@angular/core';

import { Actions } from '../actions';
import { KeyValue } from '../state';
import { NgrxFormDirective } from './directive';

@Directive({
  selector: 'form[ngrxFormState][ngrxFormsAction]',
})
export class NgrxLocalFormDirective<TStateValue extends KeyValue> extends NgrxFormDirective<TStateValue> {
  public readonly ngrxFormsAction = output<Actions<TStateValue>>();

  protected override dispatchAction(action: Actions<TStateValue>) {
    this.ngrxFormsAction.emit(action);
  }
}
