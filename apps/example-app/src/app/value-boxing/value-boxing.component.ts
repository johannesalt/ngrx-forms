import { AsyncPipe, JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  FormGroupState,
  NgrxFallbackSelectOption,
  NgrxFormControlDirective,
  NgrxSelectMultipleOption,
  NgrxSelectMultipleViewAdapter,
  NgrxSelectOption,
  NgrxStatusCssClassesDirective,
  unbox,
} from 'ngrx-form-state';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { FormExampleComponent } from '../shared/form-example/form-example.component';
import { FormValue, State } from './value-boxing.reducer';

@Component({
  selector: 'ngf-value-boxing',
  templateUrl: './value-boxing.component.html',
  styleUrls: ['./value-boxing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    FormExampleComponent,
    JsonPipe,
    NgrxFallbackSelectOption,
    NgrxFormControlDirective,
    NgrxSelectMultipleOption,
    NgrxSelectMultipleViewAdapter,
    NgrxSelectOption,
    NgrxStatusCssClassesDirective,
  ],
})
export class ValueBoxingPageComponent {
  formState$: Observable<FormGroupState<FormValue>>;

  constructor(store: Store<State>) {
    this.formState$ = store.pipe(select((s) => s.valueBoxing.formState));
  }

  unbox = unbox;
}
