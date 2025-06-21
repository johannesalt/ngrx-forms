import { Directive, forwardRef, HostListener } from '@angular/core';
import { NGRX_SELECT_VIEW_ADAPTER, SelectViewAdapter } from './option';
import { SetNativeId } from './set-native-id';
import { NGRX_FORM_VIEW_ADAPTER } from './view-adapter';

@Directive({
  selector: 'select:not([multiple])[ngrxFormControlState]',
  providers: [
    {
      provide: NGRX_FORM_VIEW_ADAPTER,
      useExisting: forwardRef(() => NgrxSelectViewAdapter),
      multi: true,
    },
    {
      provide: NGRX_SELECT_VIEW_ADAPTER,
      useExisting: forwardRef(() => NgrxSelectViewAdapter),
    },
  ],
})
export class NgrxSelectViewAdapter extends SetNativeId implements SelectViewAdapter {
  private optionMap: { [id: string]: any } = {};
  private idCounter = 0;
  private selectedId: string | null = null;
  private value: any = undefined;

  onChangeFn: (value: any) => void = () => void 0;

  @HostListener('blur')
  onTouched: () => void = () => void 0;

  setViewValue(value: any) {
    this.value = value;
    this.selectedId = this.getOptionId(value);
    if (this.selectedId === null) {
      this.renderer.setProperty(this.elementRef.nativeElement, 'selectedIndex', -1);
    }

    this.renderer.setProperty(this.elementRef.nativeElement, 'value', this.selectedId);
  }

  @HostListener('change', ['$event'])
  onChange({ target }: { target: HTMLOptionElement }) {
    this.selectedId = target.value;
    const value = this.optionMap[this.selectedId];
    this.value = value;
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

  registerOption(): string {
    const id = this.idCounter.toString();
    this.idCounter += 1;
    return id;
  }

  updateOptionValue(id: string, value: any) {
    this.optionMap[id] = value;

    if (this.selectedId === id) {
      this.onChangeFn(value);
    } else if (value === this.value) {
      this.setViewValue(value);
    }
  }

  deregisterOption(id: string) {
    delete this.optionMap[id];
  }

  private getOptionId(value: any) {
    for (const id of Array.from(Object.keys(this.optionMap))) {
      if (this.optionMap[id] === value) {
        return id;
      }
    }

    return null;
  }
}
