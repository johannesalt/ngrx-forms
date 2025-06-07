import { ChangeDetectionStrategy, Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { FormGroupState } from '@johannes-it-solution/ngrx-forms';
import { Observable } from 'rxjs';

import { FormValue, State } from './array.reducer';

@Component({
  selector: 'ngf-array',
  templateUrl: './array.component.html',
  styleUrls: ['./array.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class ArrayPageComponent {
  formState$: Observable<FormGroupState<FormValue>>;

  constructor(store: Store<State>) {
    this.formState$ = store.pipe(select((s) => s.array.formState));
  }

  trackByIndex(index: number) {
    return index;
  }
}
