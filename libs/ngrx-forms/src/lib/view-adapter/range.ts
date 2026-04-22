import { computed, Directive, forwardRef } from '@angular/core';
import { NGRX_FORM_VIEW_ADAPTER } from './view-adapter';
import { NgrxViewAdapter } from './view-adapter.directive';

@Directive({
  host: {
    '[disabled]': 'disabled()',
    '[id]': 'name()',
    '[value]': 'viewValue()',
  },
  providers: [
    {
      provide: NGRX_FORM_VIEW_ADAPTER,
      useExisting: forwardRef(() => NgrxRangeViewAdapter),
      multi: true,
    },
  ],
  selector: 'input[type=range][ngrxFormControlState]',
})
export class NgrxRangeViewAdapter extends NgrxViewAdapter<HTMLInputElement, any, number | null> {
  /**
   * @inheritdoc
   */
  public override readonly viewValue = computed(() => {
    const value = this.controlValue();
    return value === null ? '' : value;
  });

  /**
   * @inheritdoc
   */
  protected override getNativeControlValue(): number | null {
    const el = this.element.nativeElement;
    return el.value === '' ? null : parseFloat(el.value);
  }
}
