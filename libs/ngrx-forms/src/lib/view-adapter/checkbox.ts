import { Directive, forwardRef } from '@angular/core';
import { NGRX_FORM_VIEW_ADAPTER } from './view-adapter';
import { NgrxViewAdapter } from './view-adapter.directive';

@Directive({
  host: {
    '[checked]': 'viewValue()',
    '[disabled]': 'disabled()',
    '[id]': 'name()',
  },
  providers: [
    {
      provide: NGRX_FORM_VIEW_ADAPTER,
      useExisting: forwardRef(() => NgrxCheckboxViewAdapter),
      multi: true,
    },
  ],
  selector: 'input[type=checkbox][ngrxFormControlState]',
})
export class NgrxCheckboxViewAdapter extends NgrxViewAdapter<HTMLInputElement, any, boolean> {
  /**
   * @inheritdoc
   */
  protected override getNativeControlValue(): boolean {
    const el = this.element.nativeElement;
    return el.checked;
  }
}
