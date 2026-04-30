import { Directive } from '@angular/core';
import { NGRX_FORM_ACTION_DISPATCHER, NgrxFormDirective } from 'ngrx-form-state';
import { SignalStoreFormActionDispatcher } from '../dispatcher';

@Directive({
  selector: 'form[ngrxFormState]',
  hostDirectives: [
    {
      directive: NgrxFormDirective,
      inputs: ['ngrxFormState'],
    },
  ],
  providers: [{ provide: NGRX_FORM_ACTION_DISPATCHER, useClass: SignalStoreFormActionDispatcher }],
})
export class NgrxSignalFormDirective {}
