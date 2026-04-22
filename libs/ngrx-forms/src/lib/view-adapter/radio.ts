import { computed, Directive, effect, forwardRef, input, untracked } from '@angular/core';
import { NGRX_FORM_VIEW_ADAPTER } from './view-adapter';
import { NgrxViewAdapter } from './view-adapter.directive';

@Directive({
  host: {
    '[checked]': 'checked()',
    '[disabled]': 'disabled()',
    '[name]': 'name()',
    '[value]': 'value()',
  },
  providers: [
    {
      provide: NGRX_FORM_VIEW_ADAPTER,
      useExisting: forwardRef(() => NgrxRadioViewAdapter),
      multi: true,
    },
  ],
  selector: 'input[type=radio][ngrxFormControlState]',
})
export class NgrxRadioViewAdapter<TState> extends NgrxViewAdapter<HTMLInputElement, TState, TState | undefined> {
  /**
   * A signal indicating whether the radio button is checked.
   */
  public readonly checked = computed(() => this.controlValue() === this.value());

  /**
   * A signal containing the value to be submitted with the form.
   */
  public readonly value = input<TState>();

  /**
   * A side effect that will update the control state value if the value of the radio button changed.
   */
  private readonly valueChanged = effect(() => {
    this.value();

    const el = this.element.nativeElement;
    if (el.checked) {
      this.setValue();
    }
  });

  /**
   * @inheritdoc
   */
  protected override getNativeControlValue(): TState | undefined {
    const value = untracked(this.value);
    return value;
  }
}
