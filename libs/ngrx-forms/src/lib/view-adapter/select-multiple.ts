import { computed, Directive, forwardRef, signal, untracked } from '@angular/core';
import { NGRX_SELECT_VIEW_ADAPTER, NgrxSelectOption, SelectViewAdapter } from './option';
import { NGRX_FORM_VIEW_ADAPTER } from './view-adapter';
import { NgrxViewAdapter } from './view-adapter.directive';

@Directive({
  host: {
    '[disabled]': 'disabled()',
    '[id]': 'name()',
  },
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
  selector: 'select[multiple][ngrxFormControlState]',
})
export class NgrxSelectMultipleViewAdapter extends NgrxViewAdapter<HTMLSelectElement, any, any> implements SelectViewAdapter {
  protected counter = 1;
  protected options: { readonly [id: string]: NgrxSelectOption } = {};

  /**
   * A signal containing the selected IDs.
   */
  public readonly selectedIds = signal<string[]>([]);

  /**
   * A signal containing the selected values.
   */
  public readonly selectedValues = computed(() => {
    const ids = this.selectedIds();
    return ids.map((id) => this.options[id]).map((option) => option.value());
  });

  /**
   * @inheritdoc
   */
  public deregisterOption(id: string | number) {
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
  public override setViewValue(values: any): void {
    if (values === null) {
      return this.setViewValue([]);
    }

    if (!Array.isArray(values)) {
      throw new Error(`the value provided to a NgrxSelectMultipleViewAdapter must be null or an array; got ${values} of type ${typeof values}`);
    }

    for (const option of Object.values(this.options)) {
      option.selected = values.includes(option.value());
    }

    this.sync();

    super.setViewValue(values);
  }

  /**
   * @inheritdoc
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public updateOptionValue(id: string, value: any) {
    const selectedIds = untracked(this.selectedIds);
    if (selectedIds.includes(id)) {
      this.setValue();
    }
  }

  /**
   * @inheritdoc
   */
  protected override getNativeControlValue() {
    this.sync();

    return this.selectedValues();
  }

  /**
   * Updates the list of selected Ids.
   */
  protected sync(): void {
    const ids = Object.entries(this.options)
      .filter(([, option]) => option.selected)
      .map(([id]) => id);
    this.selectedIds.set(ids);
  }
}
