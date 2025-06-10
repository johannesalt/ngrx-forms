import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  FormGroupState,
  NgrxDefaultViewAdapter,
  NgrxFormControlDirective,
  NgrxNumberViewAdapter,
  NgrxStatusCssClassesDirective,
} from '@johannes-it-solution/ngrx-forms';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CustomErrorStateMatcherDirective } from '../material/error-state-matcher';
import { FormExampleComponent } from '../shared/form-example/form-example.component';
import { FormValue, State } from './async-validation.reducer';

@Component({
  selector: 'ngf-async-validation',
  templateUrl: './async-validation.component.html',
  styleUrls: ['./async-validation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    CustomErrorStateMatcherDirective,
    FormExampleComponent,
    NgrxDefaultViewAdapter,
    NgrxFormControlDirective,
    NgrxNumberViewAdapter,
    NgrxStatusCssClassesDirective,
  ],
})
export class AsyncValidationPageComponent {
  formState$: Observable<FormGroupState<FormValue>>;
  searchResults$: Observable<string[]>;

  constructor(store: Store<State>) {
    this.formState$ = store.pipe(select((s) => s.asyncValidation.formState));
    this.searchResults$ = store.pipe(select((s) => s.asyncValidation.searchResults));
  }
}
