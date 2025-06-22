import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { select, Store } from '@ngrx/store';
import {
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
import { timer } from 'rxjs';
import { map } from 'rxjs/operators';
import { CustomErrorStateMatcherDirective } from '../material/error-state-matcher';
import { FormExampleComponent } from '../shared/form-example/form-example.component';
import { BlockUIAction, State, UnblockUIAction } from './recursive-update.reducer';

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
  private readonly store = inject(Store<State>);

  public readonly formState$ = this.store.pipe(select((s) => s.recursiveUpdate.formState));

  public submit() {
    this.store.dispatch(new BlockUIAction());
    timer(1000)
      .pipe(map(() => new UnblockUIAction()))
      .subscribe(this.store);
  }
}
