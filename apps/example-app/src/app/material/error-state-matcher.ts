import { Directive, Host, Input, Optional } from '@angular/core';
import { MatChipGrid } from '@angular/material/chips';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { FormControlState } from 'ngrx-form-state';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[ngrxFormControlState]',
})
export class CustomErrorStateMatcherDirective {
  @Input() set ngrxFormControlState(state: FormControlState<any>) {
    const errorsAreShown = state.isInvalid && (state.isTouched || state.isSubmitted);

    if (this.input) {
      this.input.errorState = errorsAreShown;
      this.input.stateChanges.next();
    }

    if (this.select) {
      this.select.errorState = errorsAreShown;
      this.select.stateChanges.next();
    }

    if (this.chipGrid) {
      this.chipGrid.errorState = errorsAreShown;
      this.chipGrid.stateChanges.next();
    }
  }

  constructor(@Host() @Optional() private input: MatInput, @Host() @Optional() private select: MatSelect, @Host() @Optional() private chipGrid: MatChipGrid) {}
}
