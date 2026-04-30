import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, untracked, ViewEncapsulation } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatOption } from '@angular/material/core';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from '@angular/material/datepicker';
import { MatError, MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatListOption, MatSelectionList } from '@angular/material/list';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { MatSelect } from '@angular/material/select';
import { NgrxDefaultViewAdapter, NgrxValueConverter, NgrxValueConverters } from 'ngrx-form-state';
import { NgrxSignalFormControlDirective, NgrxSignalFormDirective } from 'ngrx-form-state/signals';
import { PrismComponent } from '../prism/prism.component';
import { FormExampleComponent } from '../shared/form-example/form-example.component';
import { INITIAL_VALUE, SignalFormState } from './signal.store';

@Component({
  selector: 'ngf-signal-store',
  imports: [
    FormExampleComponent,
    JsonPipe,
    MatFormField,
    MatButton,
    MatCheckbox,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatError,
    MatInput,
    MatLabel,
    MatListOption,
    MatOption,
    MatRadioButton,
    MatRadioGroup,
    MatSelect,
    MatSelectionList,
    MatSuffix,
    NgrxDefaultViewAdapter,
    NgrxSignalFormControlDirective,
    NgrxSignalFormDirective,
    PrismComponent,
  ],
  templateUrl: './signal-store.component.html',
  styleUrl: './signal-store.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SignalFormState],
})
export class SignalStoreComponent {
  /**
   * The signal store.
   */
  public readonly store = inject(SignalFormState);

  /**
   * A signal containing the form state.
   */
  public readonly form = this.store.form;

  /**
   * Value converter.
   */
  public readonly dateValueConverter: NgrxValueConverter<Date | null, string | null> = {
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

  /**
   * Hobbies.
   */
  public readonly hobbyOptions = ['Sports', 'Video Games'];

  /**
   * Reset the values.
   */
  public reset(): void {
    const { id } = untracked(this.form);
    this.store.setValue(id, INITIAL_VALUE);
    this.store.reset(id);
  }

  /**
   * Submit the value.
   */
  public submit(): void {
    this.store.submit();
  }
}
