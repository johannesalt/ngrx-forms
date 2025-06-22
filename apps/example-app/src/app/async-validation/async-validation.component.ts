import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { NgrxDefaultViewAdapter, NgrxFormControlDirective, NgrxNumberViewAdapter, NgrxStatusCssClassesDirective } from 'ngrx-form-state';
import { CustomErrorStateMatcherDirective } from '../material/error-state-matcher';
import { FormExampleComponent } from '../shared/form-example/form-example.component';
import { State } from './async-validation.reducer';

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
  private readonly store = inject(Store<State>);

  public readonly formState$ = this.store.pipe(select((s) => s.asyncValidation.formState));

  public readonly searchResults$ = this.store.pipe(select((s) => s.asyncValidation.searchResults));
}
