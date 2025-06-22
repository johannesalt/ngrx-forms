import { AsyncPipe, JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from '@angular/material/datepicker';
import { MatError, MatFormField, MatInput, MatSuffix } from '@angular/material/input';
import { MatListOption, MatSelectionList } from '@angular/material/list';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { MatOption, MatSelect } from '@angular/material/select';
import { select, Store } from '@ngrx/store';
import {
  NgrxDefaultViewAdapter,
  NgrxFormControlDirective,
  NgrxFormDirective,
  NgrxStatusCssClassesDirective,
  NgrxValueConverter,
  NgrxValueConverters,
  ResetAction,
  SetValueAction,
} from 'ngrx-form-state';
import { filter, map, take } from 'rxjs/operators';
import { CustomErrorStateMatcherDirective } from '../material/error-state-matcher';
import { NgrxMatSelectViewAdapter } from '../material/mat-select-view-adapter';
import { FormExampleComponent } from '../shared/form-example/form-example.component';
import { INITIAL_STATE, SetSubmittedValueAction, State } from './material.reducer';

@Component({
  selector: 'ngf-material',
  templateUrl: './material.component.html',
  styleUrls: ['./material.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    CustomErrorStateMatcherDirective,
    FormExampleComponent,
    JsonPipe,
    MatButton,
    MatCheckbox,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatError,
    MatFormField,
    MatInput,
    MatListOption,
    MatRadioButton,
    MatRadioGroup,
    MatOption,
    MatSelect,
    MatSelectionList,
    MatSuffix,
    NgrxDefaultViewAdapter,
    NgrxFormControlDirective,
    NgrxFormDirective,
    NgrxMatSelectViewAdapter,
    NgrxStatusCssClassesDirective,
  ],
})
export class MaterialPageComponent {
  private readonly store = inject(Store<State>);

  public readonly formState$ = this.store.pipe(select((s) => s.material.formState));

  public readonly submittedValue$ = this.store.pipe(select((s) => s.material.submittedValue));

  hobbyOptions = ['Sports', 'Video Games'];

  dateValueConverter: NgrxValueConverter<Date | null, string | null> = {
    convertViewToStateValue(value) {
      if (value === null) {
        return null;
      }

      // the value provided by the date picker is in local time but we want UTC so we recreate the date as UTC
      value = new Date(Date.UTC(value.getFullYear(), value.getMonth(), value.getDate()));
      return NgrxValueConverters.dateToISOString.convertViewToStateValue(value);
    },
    convertStateToViewValue: NgrxValueConverters.dateToISOString.convertStateToViewValue,
  };

  reset() {
    this.store.dispatch(new SetValueAction(INITIAL_STATE.id, INITIAL_STATE.value));
    this.store.dispatch(new ResetAction(INITIAL_STATE.id));
  }

  submit() {
    this.formState$
      .pipe(
        take(1),
        filter((s) => s.isValid),
        map((fs) => new SetSubmittedValueAction(fs.value))
      )
      .subscribe(this.store);
  }
}
