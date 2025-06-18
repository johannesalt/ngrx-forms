import { Directive, effect, ElementRef, inject, InjectionToken, input, OnDestroy, OnInit, Renderer2 } from '@angular/core';
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
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'option',
})
export class NgrxSelectOption implements OnInit, OnDestroy {
  /** Reference to the HTML element. */
  private readonly elementRef = inject(ElementRef<HTMLOptionElement>);

  /** Used to make UI changes. */
  private readonly renderer = inject(Renderer2);

  /** The value to be submitted with the form. */
  public readonly value = input<any>(undefined);

  /** Used register and deregister option. */
  public readonly viewAdapter = inject(NGRX_SELECT_VIEW_ADAPTER, {
    host: true,
    optional: true,
  });

  /** Unique ID of the option. */
  private readonly id: string | null | undefined = this.viewAdapter?.registerOption(this);

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
    if (this.id) {
      this.setProperty('value', this.id);
    }
  }

  /**
   * @inheritdoc
   */
  public ngOnDestroy(): void {
    if (this.id && this.viewAdapter) {
      this.viewAdapter.deregisterOption(this.id);
    }
  }

  /**
   * Update the option's value in view adapter. Restore teh default behaviour of Angular when an `option`
   * is used without a form state.
   */
  private readonly updateOptionValue = effect(() => {
    const value = this.value();
    if (this.id && this.viewAdapter) {
      this.viewAdapter.updateOptionValue(this.id, value);
      return;
    }

    this.setProperty('value', value);
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
