import { Directive, effect, ElementRef, inject, InjectionToken, input, OnDestroy, OnInit, Renderer2, Signal, signal, untracked } from '@angular/core';
import { FormViewAdapter } from './view-adapter';

export const NGRX_SELECT_VIEW_ADAPTER = new InjectionToken<SelectViewAdapter>('NGRX_SELECT_VIEW_ADAPTER');

export interface SelectViewAdapter extends FormViewAdapter {
  /**
   * Registers an option with the view adapter.
   * @param {NgrxSelectOption} option Option to register.
   * @returns {string} Unique option ID.
   */
  registerOption(option: NgrxSelectOption): string;

  /**
   * Removes an option from view adapter.
   * @param {string} id Unique option ID.
   */
  deregisterOption(id: string): void;

  /**
   * Update the option value.
   * @param {string} id Unique option ID.
   * @param {any} value New value.
   */
  updateOptionValue(id: string, value: any): void;
}

@Directive({
  host: {
    '[value]': 'id()',
  },
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'option',
})
export class NgrxSelectOption implements OnInit, OnDestroy {
  /**
   * A signal containing the value to be submitted with the form.
   */
  public readonly value = input<any>(undefined);

  /**
   * A signal containing the unique Id of the option or the value.
   */
  public id: Signal<any> = this.value;

  /** Reference to the HTML element. */
  private readonly elementRef = inject(ElementRef<HTMLOptionElement>);

  /** Used to make UI changes. */
  private readonly renderer = inject(Renderer2);

  /** Used register and deregister option. */
  public readonly viewAdapter = inject(NGRX_SELECT_VIEW_ADAPTER, {
    host: true,
    optional: true,
  });

  /** Returns a value indicating whether the option is selected or not. */
  public get selected(): boolean {
    const element: HTMLOptionElement = this.elementRef.nativeElement;
    return element.selected;
  }

  /** Sets a value indicating whether option is selected or not. */
  public set selected(value: boolean) {
    this.setProperty('selected', value);
  }

  /**
   * @inheritdoc
   */
  public ngOnInit(): void {
    const viewAdapter = this.viewAdapter;
    if (viewAdapter) {
      this.id = signal(viewAdapter.registerOption(this));
    }
  }

  /**
   * @inheritdoc
   */
  public ngOnDestroy(): void {
    if (this.viewAdapter) {
      const id = untracked(this.id);
      this.viewAdapter.deregisterOption(id);
    }
  }

  /**
   * Update the option's value in view adapter.
   */
  private readonly updateOptionValue = effect(() => {
    const value = this.value();
    if (!this.viewAdapter) {
      return;
    }

    const id = untracked(this.id);
    this.viewAdapter.updateOptionValue(id, value);
  });

  /**
   * Set the value of a property of an element in the DOM.
   * @param {string} name The property name.
   * @param {any} value The new value.
   */
  private setProperty(name: string, value: any): void {
    const element = this.elementRef.nativeElement;
    this.renderer.setProperty(element, name, value);
  }
}
