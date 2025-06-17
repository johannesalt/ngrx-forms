import { Directive, forwardRef, HostListener, Input, OnInit } from '@angular/core';
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
  @Input() set value(val: any) {
    if (val !== this.latestValue) {
      this.latestValue = val;
      if (this.isChecked) {
        this.onChange();
      }
    }
  }

  private latestValue: any;
  private isChecked: boolean;

  @HostListener('change')
  onChange: () => void = () => void 0;

  @HostListener('blur')
  onTouched: () => void = () => void 0;

  ngOnInit() {
    this.isChecked = (this.elementRef.nativeElement as HTMLInputElement).checked;
  }

  setViewValue(value: any): void {
    this.isChecked = value === this.latestValue;
    this.renderer.setProperty(this.elementRef.nativeElement, 'checked', this.isChecked);
  }

  setOnChangeCallback(fn: (_: any) => void): void {
    this.onChange = () => fn(this.latestValue);
  }

  setOnTouchedCallback(fn: () => void): void {
    this.onTouched = fn;
  }

  setIsDisabled(isDisabled: boolean): void {
    this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', isDisabled);
  }
}
