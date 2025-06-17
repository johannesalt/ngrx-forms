import { Directive, ElementRef, forwardRef, Host, HostListener, Input, OnDestroy, OnInit, Optional, Renderer2 } from '@angular/core';
import { SetNativeId } from './set-native-id';
import { FormViewAdapter, NGRX_FORM_VIEW_ADAPTER } from './view-adapter';

@Directive({
  selector: 'select[multiple][ngrxFormControlState]',
  providers: [
    {
      provide: NGRX_FORM_VIEW_ADAPTER,
      useExisting: forwardRef(() => NgrxSelectMultipleViewAdapter),
      multi: true,
    },
  ],
})
export class NgrxSelectMultipleViewAdapter extends SetNativeId implements FormViewAdapter {
  private options: { [id: string]: NgrxSelectMultipleOption } = {};
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
    Object.keys(this.options).forEach((id) => (this.options[id].isSelected = this.selectedIds.indexOf(id) >= 0));
  }

  @HostListener('change')
  onChange() {
    this.selectedIds = Object.keys(this.options).filter((id) => this.options[id].isSelected);
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

  registerOption(option: NgrxSelectMultipleOption) {
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

const NULL_VIEW_ADAPTER: NgrxSelectMultipleViewAdapter = {
  registerOption: () => '',
  deregisterOption: () => void 0,
  updateOptionValue: () => void 0,
} as any;

const NULL_RENDERER: Renderer2 = {
  setProperty: () => void 0,
} as any;

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'option',
})
export class NgrxSelectMultipleOption implements OnInit, OnDestroy {
  id: string;

  constructor(private element: ElementRef, private renderer: Renderer2, @Host() @Optional() private viewAdapter: NgrxSelectMultipleViewAdapter) {
    this.renderer = viewAdapter ? renderer : NULL_RENDERER;
    this.viewAdapter = viewAdapter || NULL_VIEW_ADAPTER;
    this.id = this.viewAdapter.registerOption(this);
  }

  @Input()
  set value(value: any) {
    this.viewAdapter.updateOptionValue(this.id, value);
  }

  set isSelected(selected: boolean) {
    this.renderer.setProperty(this.element.nativeElement, 'selected', selected);
  }

  get isSelected() {
    return (this.element.nativeElement as HTMLOptionElement).selected;
  }

  ngOnInit() {
    this.renderer.setProperty(this.element.nativeElement, 'value', this.id);
  }

  ngOnDestroy(): void {
    this.viewAdapter.deregisterOption(this.id);
  }
}
