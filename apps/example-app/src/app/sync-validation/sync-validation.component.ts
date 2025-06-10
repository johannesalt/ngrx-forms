import { AsyncPipe, JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  FormGroupState,
  NgrxCheckboxViewAdapter,
  NgrxDefaultViewAdapter,
  NgrxFallbackSelectOption,
  NgrxFormControlDirective,
  NgrxFormDirective,
  NgrxSelectMultipleOption,
  NgrxSelectOption,
  NgrxSelectViewAdapter,
  NgrxStatusCssClassesDirective,
  ResetAction,
  SetValueAction,
} from 'ngrx-form-state';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { CustomErrorStateMatcherDirective } from '../material/error-state-matcher';
import { FormExampleComponent } from '../shared/form-example/form-example.component';
import { FormValue, INITIAL_STATE, SetSubmittedValueAction, State } from './sync-validation.reducer';

@Component({
  selector: 'ngf-sync-validation',
  templateUrl: './sync-validation.component.html',
  styleUrls: ['./sync-validation.component.scss'],
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
    NgrxSelectMultipleOption,
    NgrxSelectOption,
    NgrxSelectViewAdapter,
    NgrxStatusCssClassesDirective,
  ],
})
export class SyncValidationPageComponent {
  formState$: Observable<FormGroupState<FormValue>>;
  submittedValue$: Observable<FormValue | undefined>;

  days = Array.from(Array(31).keys());
  months = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  years = Array.from(Array(115).keys()).map((i) => i + 1910);

  constructor(private store: Store<State>) {
    this.formState$ = store.pipe(select((s) => s.syncValidation.formState));
    this.submittedValue$ = store.pipe(select((s) => s.syncValidation.submittedValue));
  }

  reset() {
    this.store.dispatch(new SetValueAction(INITIAL_STATE.id, INITIAL_STATE.value));
    this.store.dispatch(new ResetAction(INITIAL_STATE.id));
  }

  submit() {
    this.formState$
      .pipe(
        take(1),
        filter((s) => s.isValid),
        map((fs) => new SetSubmittedValueAction(fs.value))
      )
      .subscribe(this.store);
  }
}
