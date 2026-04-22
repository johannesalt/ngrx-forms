import { Directive, HostListener, inject, input, untracked } from '@angular/core';
import { NGRX_FORM_ACTION_DISPATCHER, NgrxFormActionDispatcher } from '../dispatcher';
import { FormGroupState, KeyValue } from '../state';

@Directive({
  selector: 'form[ngrxFormState]',
  providers: [{ provide: NGRX_FORM_ACTION_DISPATCHER, useClass: NgrxFormActionDispatcher }],
})
export class NgrxFormDirective<TStateValue extends KeyValue> {
  /**
   * Used to dispatch actions such as mark as submitted.
   */
  private readonly dispatcher = inject(NGRX_FORM_ACTION_DISPATCHER);

  /**
   * The control state to bind to.
   */
  public readonly control = input.required<FormGroupState<TStateValue>>({ alias: 'ngrxFormState' });

  /**
   * Sets the status of the field to `submitted`.
   * @param event Event arguments.
   */
  @HostListener('submit', ['$event'])
  public markAsSubmitted(event: { preventDefault: () => void }) {
    event.preventDefault();

    const { id, isUnsubmitted } = untracked(this.control);
    if (isUnsubmitted) {
      this.dispatcher.markAsSubmitted(id);
    }
  }
}
