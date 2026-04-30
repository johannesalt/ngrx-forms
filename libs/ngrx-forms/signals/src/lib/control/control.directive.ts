import { Directive } from '@angular/core';
import { NGRX_FORM_ACTION_DISPATCHER, NgrxFormControlDirective } from 'ngrx-form-state';
import { SignalStoreFormActionDispatcher } from '../dispatcher/signal-store-form-action-dispatcher';

@Directive({
  selector: '[ngrxFormControlState]',
  hostDirectives: [
    {
      directive: NgrxFormControlDirective,
      inputs: ['ngrxEnableFocusTracking', 'ngrxFormControlState', 'ngrxUpdateOn', 'ngrxValueConverter'],
    },
  ],
  providers: [{ provide: NGRX_FORM_ACTION_DISPATCHER, useClass: SignalStoreFormActionDispatcher }],
})
export class NgrxSignalFormControlDirective {}
