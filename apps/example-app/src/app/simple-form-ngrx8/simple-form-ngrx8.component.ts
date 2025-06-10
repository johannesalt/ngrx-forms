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
} from 'ngrx-form-state';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { CustomErrorStateMatcherDirective } from '../material/error-state-matcher';
import { FormExampleComponent } from '../shared/form-example/form-example.component';
import { FormValue, INITIAL_STATE, setSubmittedValue, State } from './simple-form-ngrx8.reducer';

@Component({
  selector: 'ngf-simple-form-ngrx8',
  templateUrl: './simple-form-ngrx8.component.html',
  styleUrls: ['./simple-form-ngrx8.component.scss'],
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
export class SimpleFormNgrx8PageComponent {
  formState$: Observable<FormGroupState<FormValue>>;
  submittedValue$: Observable<FormValue | undefined>;

  constructor(private store: Store<State>) {
    this.formState$ = store.pipe(select((s) => s.simpleFormNgrx8.formState));
    this.submittedValue$ = store.pipe(select((s) => s.simpleFormNgrx8.submittedValue));
  }

  reset() {
    this.store.dispatch(new SetValueAction(INITIAL_STATE.id, INITIAL_STATE.value));
    this.store.dispatch(new ResetAction(INITIAL_STATE.id));
  }

  submit() {
    this.formState$
      .pipe(
        take(1),
        map((fs) => setSubmittedValue({ submittedValue: fs.value }))
      )
      .subscribe(this.store);
  }
}
