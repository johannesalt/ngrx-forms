import { Directive, effect, forwardRef, HostListener, input, OnInit } from '@angular/core';
import { SetNativeName } from './set-native-name';
import { FormViewAdapter, NGRX_FORM_VIEW_ADAPTER } from './view-adapter';

@Directive({
  selector: 'input[type=radio][ngrxFormControlState]',
  providers: [
    {
      provide: NGRX_FORM_VIEW_ADAPTER,
      useExisting: forwardRef(() => NgrxRadioViewAdapter),
      multi: true,
    },
  ],
})
export class NgrxRadioViewAdapter extends SetNativeName implements FormViewAdapter, OnInit {
  public readonly value = input<any>();

  private readonly onValueChanged = effect(() => {
    this.value();

    if (this.isChecked) {
      this.onChange();
    }
  });

  private isChecked = false;

  @HostListener('change')
  onChange: () => void = () => void 0;

  @HostListener('blur')
  onTouched: () => void = () => void 0;

  ngOnInit() {
    this.isChecked = (this.elementRef.nativeElement as HTMLInputElement).checked;
  }

  setViewValue(value: any): void {
    this.isChecked = value === this.value();
    this.renderer.setProperty(this.elementRef.nativeElement, 'checked', this.isChecked);
  }

  setOnChangeCallback(fn: (_: any) => void): void {
    this.onChange = () => fn(this.value());
  }

  setOnTouchedCallback(fn: () => void): void {
    this.onTouched = fn;
  }

  setIsDisabled(isDisabled: boolean): void {
    this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', isDisabled);
  }
}
