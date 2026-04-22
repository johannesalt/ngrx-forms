import { computed, Directive, ElementRef, HostListener, inject, input, Signal, signal } from '@angular/core';
import { AbstractControlState } from '../state';
import { FormViewAdapter } from './view-adapter';

@Directive()
export abstract class NgrxViewAdapter<TElement extends HTMLElement, TState, TView = unknown> implements FormViewAdapter {
  private onChange: (value: any) => void = () => void 0;
  private onTouched: () => void = () => void 0;

  /**
   * The control state to bind to the underlying form control.
   */
  public readonly control = input.required<AbstractControlState<TState>>({ alias: 'ngrxFormControlState' });

  /**
   * The DOM element hosting this field.
   */
  protected readonly element = inject<ElementRef<TElement>>(ElementRef);

  /**
   * Unique Id of the HTML element.
   */
  public readonly id = input<string | null | undefined>(undefined);

  /**
   * A signal indicating whether the field is currently is disabled.
   */
  public readonly disabled = signal(false);

  /**
   * A signal containing the unique name of the field.
   */
  public readonly name = computed(() => {
    const id = this.id();
    if (id) {
      return id;
    }

    const { id: name } = this.control();
    return name;
  });

  /**
   * A signal containing the value of the field.
   */
  public readonly controlValue = signal<TView | null>(null);

  /**
   * A signal containing the value to bind to the field.
   */
  public readonly viewValue: Signal<any> = computed(() => this.controlValue());

  /**
   * @inheritdoc
   */
  public setOnChangeCallback(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  /**
   * @inheritdoc
   */
  public setOnTouchedCallback(fn: () => void): void {
    this.onTouched = fn;
  }

  /**
   * @inheritdoc
   */
  public setIsDisabled(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  /**
   * @inheritdoc
   */
  public setViewValue(value: any): void {
    this.controlValue.set(value);
  }

  /**
   * Returns the value from native control element.
   */
  protected abstract getNativeControlValue(): TView;

  /**
   * Sets the touched status of the field to `true`.
   */
  @HostListener('blur')
  protected markAsTouched(): void {
    this.onTouched();
  }

  /**
   * Sets / updates the value in the underlying state.
   */
  @HostListener('change')
  @HostListener('input')
  protected setValue(): void {
    const value = this.getNativeControlValue();
    this.onChange(value);
  }
}
