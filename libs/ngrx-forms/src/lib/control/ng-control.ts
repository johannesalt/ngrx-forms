import { AbstractControl, ControlValueAccessor, FormControlStatus, ValidationErrors, ValidatorFn } from '@angular/forms';
import { NgrxFormControlDirective } from './directive';

interface CombinedControl<TViewValue> {
  /**
   * The abstract control.
   */
  control: AbstractControl<any, any>;

  /**
   * {@link AbstractControl.dirty}
   */
  dirty: boolean;

  /**
   * {@link AbstractControl.disabled}
   */
  disabled: boolean;

  /**
   * {@link AbstractControl.enabled}
   */
  enabled: boolean;

  /**
   * {@link AbstractControl.errors}
   */
  errors: ValidationErrors | null;

  /**
   * {@link AbstractControl.invalid}
   */
  invalid: boolean;

  /**
   * {@link AbstractControl.pristine}
   */
  pristine: boolean;

  /**
   * {@link AbstractControl.status}
   */
  status: FormControlStatus;

  /**
   * {@link AbstractControl.touched}
   */
  touched: boolean;

  /**
   * {@link AbstractControl.untouched}
   */
  untouched: boolean;

  /**
   * {@link AbstractControl.valid}
   */
  valid: boolean;

  /**
   * {@link AbstractControl.value}
   */
  value: TViewValue;

  /**
   * {@link NgControl.valueAccessor}
   */
  valueAccessor: ControlValueAccessor | null;

  /**
   * {@link AbstractControl.hasValidator}
   */
  hasValidator(validator: ValidatorFn): boolean;

  /**
   * {@link AbstractControl.updateValueAndValidity}
   */
  updateValueAndValidity(): void;
}

/**
 * A fake version of `NgControl` provided by the `Field` directive. This allows interoperability
 * with a wider range of components designed to work with reactive forms, in particular ones that
 * inject the `NgControl`. The interop control does not implement *all* properties and methods of
 * the real `NgControl`, but does implement some of the most commonly used ones that have a clear
 * equivalent in signal forms.
 */
export class InteropNgControl<TState, TView = TState> implements CombinedControl<TView> {
  /**
   * @inheritdoc
   */
  public readonly control = this as unknown as AbstractControl<any, any>;

  /**
   * @inheritdoc
   */
  public valueAccessor: ControlValueAccessor | null = null;

  constructor(private formControl: NgrxFormControlDirective<TState, TView>) {}

  /**
   * @inheritdoc
   */
  public get dirty(): boolean {
    return this.formControl.isDirty();
  }

  /**
   * @inheritdoc
   */
  public get disabled(): boolean {
    return this.formControl.isDisabled();
  }

  /**
   * @inheritdoc
   */
  public get enabled(): boolean {
    return this.formControl.isEnabled();
  }

  /**
   * @inheritdoc
   */
  public get errors(): ValidationErrors | null {
    return this.formControl.errors();
  }

  /**
   * @inheritdoc
   */
  public get invalid(): boolean {
    return this.formControl.isInvalid();
  }

  /**
   * @inheritdoc
   */
  public get pristine(): boolean {
    return this.formControl.isPristine();
  }

  /**
   * @inheritdoc
   */
  public get status(): FormControlStatus {
    if (this.formControl.isDisabled()) {
      return 'DISABLED';
    }

    if (this.formControl.isValid()) {
      return 'VALID';
    }

    if (this.formControl.isInvalid()) {
      return 'INVALID';
    }

    if (this.formControl.isValidationPending()) {
      return 'PENDING';
    }

    throw new Error('Unknown form control status');
  }

  /**
   * @inheritdoc
   */
  public get touched(): boolean {
    return this.formControl.isTouched();
  }

  /**
   * @inheritdoc
   */
  public get untouched(): boolean {
    return this.formControl.isUntouched();
  }

  /**
   * @inheritdoc
   */
  public get valid(): boolean {
    return this.formControl.isValid();
  }

  /**
   * @inheritdoc
   */
  public get value(): TView {
    return this.formControl.viewValue();
  }

  /**
   * @inheritdoc
   */
  public hasValidator(): boolean {
    return false;
  }

  /**
   * @inheritdoc
   */
  public updateValueAndValidity(): void {
    // No-op since value and validity are always up to date.
    // We offer this method so that reactive forms code attempting to call it doesn't error.
  }
}
