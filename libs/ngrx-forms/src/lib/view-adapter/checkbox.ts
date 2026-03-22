import { Directive, forwardRef, HostListener } from '@angular/core';
import { ControlIdDirective } from './control-id.directive';
import { FormViewAdapter, NGRX_FORM_VIEW_ADAPTER } from './view-adapter';

@Directive({
  selector: 'input[type=checkbox][ngrxFormControlState]',
  providers: [
    {
      provide: NGRX_FORM_VIEW_ADAPTER,
      useExisting: forwardRef(() => NgrxCheckboxViewAdapter),
      multi: true,
    },
  ],
})
export class NgrxCheckboxViewAdapter extends ControlIdDirective implements FormViewAdapter {
  onChange: (value: any) => void = () => void 0;

  @HostListener('blur')
  onTouched: () => void = () => void 0;

  setViewValue(value: any): void {
    this.renderer.setProperty(this.elementRef.nativeElement, 'checked', value);
  }

  setOnChangeCallback(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  setOnTouchedCallback(fn: () => void): void {
    this.onTouched = fn;
  }

  setIsDisabled(isDisabled: boolean): void {
    this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', isDisabled);
  }

  @HostListener('change', ['$event'])
  handleInput({ target }: Event): void {
    const input = target as HTMLInputElement;
    if (!input) {
      return;
    }

    this.onChange(input.checked);
  }
}
