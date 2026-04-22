import { Directive, output } from '@angular/core';
import { Actions } from '../actions';
import { BaseFormActionDispatcher, NGRX_FORM_ACTION_DISPATCHER } from '../dispatcher';
import { KeyValue } from '../state';
import { NgrxFormDirective } from './directive';

@Directive({
  selector: 'form[ngrxFormsAction]',
  hostDirectives: [
    {
      directive: NgrxFormDirective,
      inputs: ['ngrxFormState'],
    },
  ],
  providers: [{ provide: NGRX_FORM_ACTION_DISPATCHER, useExisting: NgrxLocalFormDirective }],
})
export class NgrxLocalFormDirective<TStateValue extends KeyValue> extends BaseFormActionDispatcher<TStateValue> {
  public readonly ngrxFormsAction = output<Actions<TStateValue>>();

  /**
   * @inheritdoc
   */
  public override dispatch(action: Actions<TStateValue>): void {
    this.ngrxFormsAction.emit(action);
  }
}
