import { AsyncPipe, JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  FormGroupState,
  NgrxCheckboxViewAdapter,
  NgrxDefaultViewAdapter,
  NgrxFallbackSelectOption,
  NgrxFormControlDirective,
  NgrxFormDirective,
  NgrxRadioViewAdapter,
  NgrxSelectMultipleOption,
  NgrxSelectOption,
  NgrxSelectViewAdapter,
  NgrxStatusCssClassesDirective,
  ResetAction,
  SetValueAction,
} from '@johannes-it-solution/ngrx-forms';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { CustomErrorStateMatcherDirective } from '../material/error-state-matcher';
import { FormExampleComponent } from '../shared/form-example/form-example.component';
import { FormValue, INITIAL_STATE, SetSubmittedValueAction, State } from './simple-form.reducer';

@Component({
  selector: 'ngf-simple-form',
  templateUrl: './simple-form.component.html',
  styleUrls: ['./simple-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    CustomErrorStateMatcherDirective,
    FormExampleComponent,
    JsonPipe,
    NgrxCheckboxViewAdapter,
    NgrxDefaultViewAdapter,
    NgrxFallbackSelectOption,
    NgrxFormControlDirective,
    NgrxFormDirective,
    NgrxRadioViewAdapter,
    NgrxSelectMultipleOption,
    NgrxSelectOption,
    NgrxSelectViewAdapter,
    NgrxStatusCssClassesDirective,
  ],
})
export class SimpleFormPageComponent {
  formState$: Observable<FormGroupState<FormValue>>;
  submittedValue$: Observable<FormValue | undefined>;

  constructor(private store: Store<State>) {
    this.formState$ = store.pipe(select((s) => s.simpleForm.formState));
    this.submittedValue$ = store.pipe(select((s) => s.simpleForm.submittedValue));
  }

  reset() {
    this.store.dispatch(new SetValueAction(INITIAL_STATE.id, INITIAL_STATE.value));
    this.store.dispatch(new ResetAction(INITIAL_STATE.id));
  }

  submit() {
    this.formState$
      .pipe(
        take(1),
        map((fs) => new SetSubmittedValueAction(fs.value))
      )
      .subscribe(this.store);
  }
}
