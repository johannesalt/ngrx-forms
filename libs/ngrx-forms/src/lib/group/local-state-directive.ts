import { Directive, EventEmitter, Output } from '@angular/core';

import { Actions } from '../actions';
import { KeyValue } from '../state';
import { NgrxFormDirective } from './directive';

@Directive({
  selector: 'form[ngrxFormState][ngrxFormsAction]',
  standalone: false,
})
export class NgrxLocalFormDirective<TStateValue extends KeyValue> extends NgrxFormDirective<TStateValue> {
  @Output() ngrxFormsAction = new EventEmitter<Actions<TStateValue>>();

  constructor() {
    super(null);
  }

  protected override dispatchAction(action: Actions<TStateValue>) {
    this.ngrxFormsAction.emit(action);
  }
}
