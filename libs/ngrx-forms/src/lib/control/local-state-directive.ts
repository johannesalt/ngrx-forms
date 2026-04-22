import { Directive, forwardRef, output } from '@angular/core';
import { Actions } from '../actions';
import { BaseFormActionDispatcher, NGRX_FORM_ACTION_DISPATCHER } from '../dispatcher';
import { NgrxFormControlDirective } from './directive';

@Directive({
  selector: '[ngrxFormControlState][ngrxFormsAction]',
  hostDirectives: [
    {
      directive: NgrxFormControlDirective,
      inputs: ['ngrxEnableFocusTracking', 'ngrxFormControlState', 'ngrxUpdateOn', 'ngrxValueConverter'],
    },
  ],
  providers: [{ provide: NGRX_FORM_ACTION_DISPATCHER, useExisting: forwardRef(() => NgrxLocalFormControlDirective) }],
})
export class NgrxLocalFormControlDirective<TStateValue> extends BaseFormActionDispatcher<TStateValue> {
  public readonly ngrxFormsAction = output<Actions<TStateValue>>();

  /**
   * @inheritdoc
   */
  public override dispatch(action: Actions<TStateValue>): void {
    this.ngrxFormsAction.emit(action);
  }
}
