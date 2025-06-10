import { AsyncPipe } from '@angular/common';
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
} from 'ngrx-form-state';
import { select, Store } from '@ngrx/store';
import { Observable, timer } from 'rxjs';
import { map } from 'rxjs/operators';
import { CustomErrorStateMatcherDirective } from '../material/error-state-matcher';
import { FormExampleComponent } from '../shared/form-example/form-example.component';
import { BlockUIAction, FormValue, State, UnblockUIAction } from './recursive-update.reducer';

@Component({
  selector: 'ngf-recursive-update',
  templateUrl: './recursive-update.component.html',
  styleUrls: ['./recursive-update.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    CustomErrorStateMatcherDirective,
    FormExampleComponent,
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
export class RecursiveUpdatePageComponent {
  formState$: Observable<FormGroupState<FormValue>>;

  constructor(private store: Store<State>) {
    this.formState$ = store.pipe(select((s) => s.recursiveUpdate.formState));
  }

  submit() {
    this.store.dispatch(new BlockUIAction());
    timer(1000)
      .pipe(map(() => new UnblockUIAction()))
      .subscribe(this.store);
  }
}
