import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormGroupState, NgrxCheckboxViewAdapter, NgrxFormControlDirective, NgrxStatusCssClassesDirective } from '@johannes-it-solution/ngrx-forms';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CustomErrorStateMatcherDirective } from '../material/error-state-matcher';
import { FormExampleComponent } from '../shared/form-example/form-example.component';
import { FormValue, State } from './array.reducer';

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
  formState$: Observable<FormGroupState<FormValue>>;

  constructor(store: Store<State>) {
    this.formState$ = store.pipe(select((s) => s.array.formState));
  }
}
