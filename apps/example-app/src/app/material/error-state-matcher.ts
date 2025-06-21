import { computed, Directive, effect, inject, input } from '@angular/core';
import { MatChipGrid } from '@angular/material/chips';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { FormControlState } from 'ngrx-form-state';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[ngrxFormControlState]',
})
export class CustomErrorStateMatcherDirective {
  public readonly ngrxFormControlState = input.required<FormControlState<any>>();

  private readonly chipGrid = inject(MatChipGrid, { host: true, optional: true });

  private readonly errorsAreShown = computed(() => {
    const { isInvalid, isTouched, isSubmitted } = this.ngrxFormControlState();
    return isInvalid && (isTouched || isSubmitted);
  });

  private readonly input = inject(MatInput, { host: true, optional: true });

  private readonly select = inject(MatSelect, { host: true, optional: true });

  private readonly updateErrorState = effect(() => {
    const errorsAreShown = this.errorsAreShown();

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
  });
}
