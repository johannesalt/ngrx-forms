import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from '@angular/material/datepicker';
import { MatFormField, MatInput, MatSuffix } from '@angular/material/input';
import { select, Store } from '@ngrx/store';
import { NgrxDefaultViewAdapter, NgrxFormControlDirective, NgrxStatusCssClassesDirective, NgrxValueConverters } from 'ngrx-form-state';
import { CustomErrorStateMatcherDirective } from '../material/error-state-matcher';
import { FormExampleComponent } from '../shared/form-example/form-example.component';
import { State } from './value-conversion.reducer';

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
  private readonly store = inject(Store<State>);

  public readonly formState$ = this.store.pipe(select((s) => s.valueConversion.formState));

  public readonly dateToISOString = NgrxValueConverters.dateToISOString;
}
