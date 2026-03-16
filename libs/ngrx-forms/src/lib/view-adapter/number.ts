import { Directive, forwardRef, HostListener } from '@angular/core';
import { ControlIdDirective } from './control-id.directive';
import { FormViewAdapter, NGRX_FORM_VIEW_ADAPTER } from './view-adapter';

@Directive({
  selector: 'input[type=number][ngrxFormControlState]',
  providers: [
    {
      provide: NGRX_FORM_VIEW_ADAPTER,
      useExisting: forwardRef(() => NgrxNumberViewAdapter),
      multi: true,
    },
  ],
})
export class NgrxNumberViewAdapter extends ControlIdDirective implements FormViewAdapter {
  onChange: (value: any) => void = () => void 0;

  @HostListener('blur')
  onTouched: () => void = () => void 0;

  setViewValue(value: any): void {
    // The value needs to be normalized for IE9, otherwise it is set to 'null' when null
    const normalizedValue = value === null ? '' : value;
    this.renderer.setProperty(this.elementRef.nativeElement, 'value', normalizedValue);
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
  @HostListener('input', ['$event'])
  handleInput({ target }: Event): void {
    const input = target as HTMLInputElement;
    if (!input) {
      return;
    }

    const value = input.value;
    this.onChange(value === '' ? null : parseFloat(value));
  }
}
