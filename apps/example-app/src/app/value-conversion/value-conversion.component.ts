import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from '@angular/material/datepicker';
import { MatFormField, MatInput, MatSuffix } from '@angular/material/input';
import { FormGroupState, NgrxDefaultViewAdapter, NgrxFormControlDirective, NgrxStatusCssClassesDirective, NgrxValueConverters } from 'ngrx-form-state';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CustomErrorStateMatcherDirective } from '../material/error-state-matcher';
import { FormExampleComponent } from '../shared/form-example/form-example.component';
import { FormValue, State } from './value-conversion.reducer';

@Component({
  selector: 'ngf-value-conversion',
  templateUrl: './value-conversion.component.html',
  styleUrls: ['./value-conversion.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    CustomErrorStateMatcherDirective,
    FormExampleComponent,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatFormField,
    MatInput,
    MatSuffix,
    NgrxDefaultViewAdapter,
    NgrxFormControlDirective,
    NgrxStatusCssClassesDirective,
  ],
})
export class ValueConversionPageComponent {
  formState$: Observable<FormGroupState<FormValue>>;

  constructor(store: Store<State>) {
    this.formState$ = store.pipe(select((s) => s.valueConversion.formState));
  }

  dateToISOString = NgrxValueConverters.dateToISOString;
}
