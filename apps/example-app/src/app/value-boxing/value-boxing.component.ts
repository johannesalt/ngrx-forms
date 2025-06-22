import { AsyncPipe, JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { select, Store } from '@ngrx/store';
import {
  NgrxFallbackSelectOption,
  NgrxFormControlDirective,
  NgrxSelectMultipleOption,
  NgrxSelectMultipleViewAdapter,
  NgrxSelectOption,
  NgrxStatusCssClassesDirective,
  unbox,
} from 'ngrx-form-state';
import { FormExampleComponent } from '../shared/form-example/form-example.component';
import { State } from './value-boxing.reducer';

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
  private readonly store = inject(Store<State>);

  public readonly formState$ = this.store.pipe(select((s) => s.valueBoxing.formState));

  unbox = unbox;
}
