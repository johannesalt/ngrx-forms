import { Directive, forwardRef, HostListener } from '@angular/core';
import { NGRX_SELECT_VIEW_ADAPTER, NgrxSelectOption, SelectViewAdapter } from './option';
import { SetNativeId } from './set-native-id';
import { NGRX_FORM_VIEW_ADAPTER } from './view-adapter';

@Directive({
  selector: 'select[multiple][ngrxFormControlState]',
  providers: [
    {
      provide: NGRX_FORM_VIEW_ADAPTER,
      useExisting: forwardRef(() => NgrxSelectMultipleViewAdapter),
      multi: true,
    },
    {
      provide: NGRX_SELECT_VIEW_ADAPTER,
      useExisting: forwardRef(() => NgrxSelectMultipleViewAdapter),
    },
  ],
})
export class NgrxSelectMultipleViewAdapter extends SetNativeId implements SelectViewAdapter {
  private options: { [id: string]: NgrxSelectOption } = {};
  private optionValues: { [id: string]: any } = {};
  private idCounter = 0;
  private selectedIds: string[] = [];

  onChangeFn: (value: any) => void = () => void 0;

  @HostListener('blur')
  onTouched: () => void = () => void 0;

  setViewValue(value: any) {
    if (value === null) {
      value = [];
    }

    if (!Array.isArray(value)) {
      throw new Error(`the value provided to a NgrxSelectMultipleViewAdapter must be null or an array; got ${value} of type ${typeof value}`); // `
    }

    this.selectedIds = value
      .map((v) => this.getOptionId(v))
      .filter((id) => id !== null)
      .map((id) => id as string);
    Object.keys(this.options).forEach((id) => (this.options[id].selected = this.selectedIds.indexOf(id) >= 0));
  }

  @HostListener('change')
  onChange() {
    this.selectedIds = Object.keys(this.options).filter((id) => this.options[id].selected);
    const value = this.selectedIds.map((id) => this.optionValues[id]);
    this.onChangeFn(value);
  }

  setOnChangeCallback(fn: (value: any) => void) {
    this.onChangeFn = fn;
  }

  setOnTouchedCallback(fn: () => void) {
    this.onTouched = fn;
  }

  setIsDisabled(isDisabled: boolean) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', isDisabled);
  }

  registerOption(option: NgrxSelectOption): string {
    const id = this.idCounter.toString();
    this.options[id] = option;
    this.idCounter += 1;
    return id;
  }

  updateOptionValue(id: string, value: any) {
    this.optionValues[id] = value;

    if (this.selectedIds.indexOf(id) >= 0) {
      this.onChange();
    }
  }

  deregisterOption(id: string) {
    delete this.options[id];
    delete this.optionValues[id];
  }

  private getOptionId(value: any) {
    for (const id of Array.from(Object.keys(this.optionValues))) {
      if (this.optionValues[id] === value) {
        return id;
      }
    }

    return null;
  }
}
