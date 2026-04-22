import { computed, Directive, forwardRef, signal, untracked } from '@angular/core';
import { NGRX_SELECT_VIEW_ADAPTER, NgrxSelectOption, SelectViewAdapter } from './option';
import { NGRX_FORM_VIEW_ADAPTER } from './view-adapter';
import { NgrxViewAdapter } from './view-adapter.directive';

@Directive({
  host: {
    '[disabled]': 'disabled()',
    '[id]': 'name()',
    '[selectedIndex]': 'selectedIndex()',
    '[value]': 'selectedId()',
  },
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
  selector: 'select:not([multiple])[ngrxFormControlState]',
})
export class NgrxSelectViewAdapter extends NgrxViewAdapter<HTMLSelectElement, any, any> implements SelectViewAdapter {
  private counter = 1;
  private options: { readonly [id: string]: NgrxSelectOption } = {};

  /**
   * A signal containing the selected Id.
   */
  public readonly selectedId = signal<string | undefined>(undefined);

  /**
   * A signal containing the selected index.
   */
  public readonly selectedIndex = computed(() => {
    const id = this.selectedId();
    if (id === undefined) {
      return -1;
    }

    return null;
  });

  /**
   * A signal containing the selected values.
   */
  public readonly selectedValue = computed(() => {
    const id = this.selectedId();
    if (id) {
      const option = this.options[id];
      return option?.value();
    }

    return undefined;
  });

  /**
   * @inheritdoc
   */
  public deregisterOption(id: string) {
    this.options = Object.entries(this.options)
      .filter(([key]) => key !== id)
      .reduce((result, [key, option]) => ({ ...result, [key]: option }), {});
  }

  /**
   * @inheritdoc
   */
  public registerOption(option: NgrxSelectOption): string {
    const id = this.counter.toString();

    this.counter += 1;
    this.options = { ...(this.options ?? {}), [id]: option };

    return id;
  }

  /**
   * @inheritdoc
   */
  public override setViewValue(value: any) {
    const ids = Object.entries(this.options)
      .filter(([, option]) => option.value() === value)
      .map(([key]) => key);
    this.selectedId.set([...ids].shift());

    super.setViewValue(value);
  }

  /**
   * @inheritdoc
   */
  public updateOptionValue(id: string, value: any) {
    const controlValue = untracked(this.controlValue);
    const selectedId = untracked(this.selectedId);

    if (selectedId === id) {
      return this.setValue();
    }

    if (value === controlValue) {
      return this.selectedId.set(id);
    }
  }

  /**
   * @inheritdoc
   */
  protected override getNativeControlValue() {
    this.sync();

    return this.selectedValue();
  }

  /**
   * Updates the selected Id.
   */
  private sync(): void {
    const el = this.element.nativeElement;
    const value = el.value;
    this.selectedId.set(value);
  }
}
