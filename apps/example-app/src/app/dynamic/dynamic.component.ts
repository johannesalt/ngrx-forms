import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  AddArrayControlAction,
  FormGroupState,
  NgrxCheckboxViewAdapter,
  NgrxFormControlDirective,
  NgrxStatusCssClassesDirective,
  RemoveArrayControlAction,
} from 'ngrx-form-state';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { CustomErrorStateMatcherDirective } from '../material/error-state-matcher';
import { FormExampleComponent } from '../shared/form-example/form-example.component';
import { CreateGroupElementAction, FormValue, RemoveGroupElementAction, State } from './dynamic.reducer';

@Component({
  selector: 'ngf-dynamic',
  templateUrl: './dynamic.component.html',
  styleUrls: ['./dynamic.component.scss'],
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
export class DynamicPageComponent {
  formState$: Observable<FormGroupState<FormValue>>;
  arrayOptions$: Observable<number[]>;
  groupOptions$: Observable<string[]>;

  constructor(private store: Store<State>) {
    this.formState$ = store.pipe(select((s) => s.dynamic.formState));
    this.arrayOptions$ = store.pipe(select((s) => s.dynamic.array.options));
    this.groupOptions$ = store.pipe(select((s) => s.dynamic.groupOptions));
  }

  addGroupOption() {
    const name = Math.random().toString(36).substr(2, 3);
    this.store.dispatch(new CreateGroupElementAction(name));
  }

  removeGroupOption(name: string) {
    this.store.dispatch(new RemoveGroupElementAction(name));
  }

  addArrayOption(index: number) {
    this.formState$
      .pipe(
        take(1),
        map((s) => s.controls.array.id),
        map((id) => new AddArrayControlAction(id, false, index))
      )
      .subscribe(this.store);
  }

  removeArrayOption(index: number) {
    this.formState$
      .pipe(
        take(1),
        map((s) => s.controls.array.id),
        map((id) => new RemoveArrayControlAction(id, index))
      )
      .subscribe(this.store);
  }

  trackById(_: number, id: string) {
    return id;
  }
}
