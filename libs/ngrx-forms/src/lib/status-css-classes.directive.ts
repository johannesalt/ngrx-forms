import { computed, Directive, input } from '@angular/core';
import { AbstractControlState } from './state';

/**
 * Lists the available status class names based on the property
 * they are depending on.
 */
export const NGRX_STATUS_CLASS_NAMES = {
  isValid: 'ngrx-forms-valid',
  isInvalid: 'ngrx-forms-invalid',
  isDirty: 'ngrx-forms-dirty',
  isPristine: 'ngrx-forms-pristine',
  isTouched: 'ngrx-forms-touched',
  isUntouched: 'ngrx-forms-untouched',
  isSubmitted: 'ngrx-forms-submitted',
  isUnsubmitted: 'ngrx-forms-unsubmitted',
  isValidationPending: 'ngrx-forms-validation-pending',
};

@Directive({
  selector: 'form[ngrxFormState],[ngrxFormControlState]',
  host: {
    '[class.ngrx-forms-dirty]': 'isDirty()',
    '[class.ngrx-forms-invalid]': 'isInvalid()',
    '[class.ngrx-forms-pristine]': 'isPristine()',
    '[class.ngrx-forms-submitted]': 'isSubmitted()',
    '[class.ngrx-forms-touched]': 'isTouched()',
    '[class.ngrx-forms-unsubmitted]': 'isUnsubmitted()',
    '[class.ngrx-forms-untouched]': 'isUntouched()',
    '[class.ngrx-forms-valid]': 'isValid()',
    '[class.ngrx-forms-validation-pending]': 'isValidationPending()',
  },
})
export class NgrxStatusCssClassesDirective {
  public readonly ngrxFormControlState = input<AbstractControlState<any>>();

  public readonly ngrxFormState = input<AbstractControlState<any>>();

  public readonly isDirty = computed(() => {
    const { isDirty } = this.state();
    return isDirty;
  });

  public readonly isInvalid = computed(() => {
    const { isInvalid } = this.state();
    return isInvalid;
  });

  public readonly isPristine = computed(() => {
    const { isPristine } = this.state();
    return isPristine;
  });

  public readonly isSubmitted = computed(() => {
    const { isSubmitted } = this.state();
    return isSubmitted;
  });

  public readonly isTouched = computed(() => {
    const { isTouched } = this.state();
    return isTouched;
  });

  public readonly isUnsubmitted = computed(() => {
    const { isUnsubmitted } = this.state();
    return isUnsubmitted;
  });

  public readonly isUntouched = computed(() => {
    const { isUntouched } = this.state();
    return isUntouched;
  });

  public readonly isValid = computed(() => {
    const { isValid } = this.state();
    return isValid;
  });

  public readonly isValidationPending = computed(() => {
    const { isValidationPending } = this.state();
    return isValidationPending;
  });

  private readonly state = computed(() => {
    const formState = this.ngrxFormControlState() ?? this.ngrxFormState();
    if (!formState) {
      throw 'Form state cannot be null';
    }

    return formState;
  });
}
