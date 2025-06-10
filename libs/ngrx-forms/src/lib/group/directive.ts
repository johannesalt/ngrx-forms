import { Directive, HostListener, Inject, Input, OnInit, Optional } from '@angular/core';
import { ActionsSubject } from '@ngrx/store';

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
  @Input() ngrxFormState: FormGroupState<TStateValue>;

  constructor(@Optional() @Inject(ActionsSubject) private actionsSubject: ActionsSubject | null) {
    this.actionsSubject = actionsSubject;
  }

  protected dispatchAction(action: Actions<TStateValue>) {
    if (this.actionsSubject !== null) {
      this.actionsSubject.next(action);
    } else {
      throw new Error('ActionsSubject must be present in order to dispatch actions!');
    }
  }

  ngOnInit() {
    if (!this.ngrxFormState) {
      throw new Error('The form state must not be undefined!');
    }
  }

  @HostListener('submit', ['$event'])
  onSubmit(event: CustomEvent) {
    event.preventDefault();
    if (this.ngrxFormState.isUnsubmitted) {
      this.dispatchAction(new MarkAsSubmittedAction(this.ngrxFormState.id));
    }
  }
}
