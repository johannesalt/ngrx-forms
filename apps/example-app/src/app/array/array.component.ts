import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { NgrxCheckboxViewAdapter, NgrxFormControlDirective, NgrxStatusCssClassesDirective } from 'ngrx-form-state';
import { CustomErrorStateMatcherDirective } from '../material/error-state-matcher';
import { FormExampleComponent } from '../shared/form-example/form-example.component';
import { State } from './array.reducer';

@Component({
  selector: 'ngf-array',
  templateUrl: './array.component.html',
  styleUrls: ['./array.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    CustomErrorStateMatcherDirective,
    FormExampleComponent,
    NgrxCheckboxViewAdapter,
    NgrxFormControlDirective,
    NgrxStatusCssClassesDirective,
  ],
})
export class ArrayPageComponent {
  private readonly store = inject(Store<State>);

  public readonly formState$ = this.store.pipe(select((s) => s.array.formState));
}
