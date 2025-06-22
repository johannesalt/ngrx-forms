import { Directive, HostListener, OnInit, inject, input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, MarkAsSubmittedAction } from '../actions';
import { FormGroupState, KeyValue } from '../state';

// this interface just exists to prevent a direct reference to
// `Event` in our code, which otherwise causes issues in NativeScript
// applications
type CustomEvent = Event;

@Directive({
  selector: 'form:not([ngrxFormsAction])[ngrxFormState]',
})
export class NgrxFormDirective<TStateValue extends KeyValue> implements OnInit {
  private readonly store = inject<Store>(Store, { optional: true });

  public readonly ngrxFormState = input.required<FormGroupState<TStateValue>>();

  protected dispatchAction(action: Actions<TStateValue>) {
    if (this.store == null) {
      throw new Error('Store must be present in order to dispatch actions!');
    }

    this.store.dispatch(action);
  }

  ngOnInit() {
    const state = this.ngrxFormState();
    if (!state) {
      throw new Error('The form state must not be undefined!');
    }
  }

  @HostListener('submit', ['$event'])
  onSubmit(event: CustomEvent) {
    event.preventDefault();

    const { id, isUnsubmitted } = this.ngrxFormState();
    if (isUnsubmitted) {
      this.dispatchAction(new MarkAsSubmittedAction(id));
    }
  }
}
