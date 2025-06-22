import { AfterViewInit, booleanAttribute, computed, Directive, effect, ElementRef, HostListener, inject, input, OnInit, untracked } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Actions, FocusAction, MarkAsDirtyAction, MarkAsTouchedAction, SetValueAction, UnfocusAction } from '../actions';
import { FormControlState, FormControlValueTypes } from '../state';
import { selectViewAdapter } from '../view-adapter/util';
import { FormViewAdapter, NGRX_FORM_VIEW_ADAPTER } from '../view-adapter/view-adapter';
import { NgrxValueConverters } from './value-converter';

export enum NGRX_UPDATE_ON_TYPE {
  CHANGE = 'change',
  BLUR = 'blur',
  NEVER = 'never',
}

class ControlValueAccessorAdapter implements FormViewAdapter {
  constructor(private valueAccessor: ControlValueAccessor) {}

  setViewValue(value: any): void {
    this.valueAccessor.writeValue(value);
  }

  setOnChangeCallback(fn: (value: any) => void): void {
    this.valueAccessor.registerOnChange(fn);
  }
  setOnTouchedCallback(fn: () => void): void {
    this.valueAccessor.registerOnTouched(fn);
  }

  setIsDisabled(isDisabled: boolean) {
    if (this.valueAccessor.setDisabledState) {
      this.valueAccessor.setDisabledState(isDisabled);
    }
  }
}

export type NgrxFormControlValueType<TStateValue> = TStateValue extends FormControlValueTypes ? TStateValue : never;

@Directive({
  host: {
    '[attr.cdk-focus-region-start]': 'focusRegionStart()',
  },
  selector: ':not([ngrxFormsAction])[ngrxFormControlState]',
})
export class NgrxFormControlDirective<TStateValue, TViewValue = TStateValue> implements AfterViewInit, OnInit {
  private readonly el = inject(ElementRef);

  private readonly store = inject(Store, { optional: true });

  public readonly ngrxEnableFocusTracking = input(false, { transform: booleanAttribute });

  public readonly ngrxFormControlState = input.required<FormControlState<NgrxFormControlValueType<TStateValue>>>();

  public readonly ngrxUpdateOn = input(NGRX_UPDATE_ON_TYPE.CHANGE);

  public readonly ngrxValueConverter = input(NgrxValueConverters.default<any>());

  /** Used by the CDK to set initial focus */
  public readonly focusRegionStart = computed(() => {
    const isFocused = this.isFocused();
    return isFocused ? '' : null;
  });

  /** Current form control id. */
  private readonly id = computed(() => {
    const { id } = this.ngrxFormControlState();
    return id;
  });

  /** A value indicating whether the form control is disabled or not (enabled). */
  private readonly isDisabled = computed(() => {
    const { isDisabled } = this.ngrxFormControlState();
    return isDisabled;
  });

  /** A value indicating whether the form control is focused or not (unfocused). */
  private readonly isFocused = computed(() => {
    const { isFocused } = this.ngrxFormControlState();
    return isFocused;
  });

  /** Current form value. */
  private readonly value = computed(() => {
    const { value } = this.ngrxFormControlState();
    return value;
  });

  /** Update the view if control id changed. */
  private readonly updateViewIfControlIdChanged = effect(() => {
    this.id();

    untracked(() => {
      const value = this.value();
      const valueConverter = this.ngrxValueConverter();
      this.stateValue = value;

      this.viewValue = valueConverter.convertStateToViewValue(this.stateValue);
      this.viewAdapter.setViewValue(this.viewValue);

      if (this.viewAdapter.setIsDisabled) {
        const isDisabled = this.isDisabled();
        this.viewAdapter.setIsDisabled(isDisabled);
      }
    });
  });

  /** Update the view if focus-flag changed. */
  private readonly updateViewIfIsFocusedChanged = effect(() => {
    const isFocused = this.isFocused();

    const focusTrackingEnabled = this.ngrxEnableFocusTracking();
    if (!focusTrackingEnabled) {
      return;
    }

    if (isFocused) {
      this.el.nativeElement.focus();
    } else {
      this.el.nativeElement.blur();
    }
  });

  /** Update the view if disabled-flag changed. */
  private readonly updateViewIfIsDisabledChanged = effect(() => {
    const isDisabled = this.isDisabled();
    if (!this.viewAdapter.setIsDisabled) {
      return;
    }

    this.viewAdapter.setIsDisabled(isDisabled);
  });

  /** Update the view if value changed. */
  private readonly updateViewIfValueChanged = effect(() => {
    const value = this.value();
    const valueConverter = this.ngrxValueConverter();
    this.stateValue = value;

    const viewValue = valueConverter.convertStateToViewValue(this.stateValue);
    if (viewValue !== this.viewValue) {
      this.viewValue = viewValue;
      this.viewAdapter.setViewValue(this.viewValue);
    }
  });

  private viewAdapter: FormViewAdapter;

  // we have to store the latest known state value since most input elements don't play nicely with
  // setting the same value again (e.g. input elements move the cursor to the end of the input when
  // a new value is set which means whenever the user types something the cursor is forced to the
  // end of the input) which would for example happen every time a new value is pushed to the state
  // since when the action to update the state is dispatched a new state will be received inside
  // the directive, which in turn would trigger a view update; to prevent this behavior we compare
  // the latest known state value with the value to be set and filter out those values that are equal
  // to the latest known value
  private viewValue: TViewValue;
  private stateValue: TStateValue;

  constructor() {
    const valueAccessors = inject<ControlValueAccessor[]>(NG_VALUE_ACCESSOR, { self: true, optional: true }) ?? [];
    if (valueAccessors.length > 1) {
      throw new Error('More than one custom control value accessor matches!');
    }

    const viewAdapters = inject<FormViewAdapter[]>(NGRX_FORM_VIEW_ADAPTER, { self: true, optional: true }) ?? [];
    this.viewAdapter = valueAccessors.length > 0 ? new ControlValueAccessorAdapter(valueAccessors[0]) : selectViewAdapter(viewAdapters);
  }

  protected dispatchAction(action: Actions<NgrxFormControlValueType<TStateValue>>) {
    if (this.store == null) {
      throw new Error('Store must be present in order to dispatch actions!');
    }

    this.store.dispatch(action);
  }

  private dispatchMarkAsDirtyAction() {
    const { id, isPristine } = this.ngrxFormControlState();
    if (isPristine) {
      this.dispatchAction(new MarkAsDirtyAction(id));
    }
  }

  private dispatchSetValueAction() {
    const { id, value } = this.ngrxFormControlState();
    const valueConverter = this.ngrxValueConverter();

    this.stateValue = valueConverter.convertViewToStateValue(this.viewValue);
    if (this.stateValue !== value) {
      this.dispatchAction(new SetValueAction(id, this.stateValue as NgrxFormControlValueType<TStateValue>));

      this.dispatchMarkAsDirtyAction();
    }
  }

  private handleOnChange(viewValue: TViewValue) {
    this.viewValue = viewValue;

    const updateOn = this.ngrxUpdateOn();
    if (updateOn === NGRX_UPDATE_ON_TYPE.CHANGE) {
      this.dispatchSetValueAction();
    }
  }

  private handleOnTouch() {
    const { id, isTouched } = this.ngrxFormControlState();
    const updateOn = this.ngrxUpdateOn();

    if (!isTouched && updateOn !== NGRX_UPDATE_ON_TYPE.NEVER) {
      this.dispatchAction(new MarkAsTouchedAction(id));
    }

    if (updateOn === NGRX_UPDATE_ON_TYPE.BLUR) {
      this.dispatchSetValueAction();
    }
  }

  public ngOnInit() {
    if (!this.ngrxFormControlState()) {
      throw new Error('The form state must not be undefined!');
    }

    this.viewAdapter.setOnChangeCallback(this.handleOnChange.bind(this));
    this.viewAdapter.setOnTouchedCallback(this.handleOnTouch.bind(this));
  }

  public ngAfterViewInit() {
    // we need to update the view again after it was initialized since some
    // controls depend on child elements for setting the value (e.g. selects)
    this.viewAdapter.setViewValue(this.viewValue);
    if (this.viewAdapter.setIsDisabled) {
      this.viewAdapter.setIsDisabled(this.isDisabled());
    }
  }

  @HostListener('focusin')
  public handleFocusIn() {
    const focusTrackingEnabled = this.ngrxEnableFocusTracking();
    if (!focusTrackingEnabled) {
      return;
    }

    const id = this.id();
    const isFocused = this.isFocused();
    if (!isFocused) {
      this.dispatchAction(new FocusAction(id));
    }
  }

  @HostListener('focusout')
  public handleFocusOut() {
    const focusTrackingEnabled = this.ngrxEnableFocusTracking();
    if (!focusTrackingEnabled) {
      return;
    }

    const id = this.id();
    const isFocused = this.isFocused();
    if (isFocused) {
      this.dispatchAction(new UnfocusAction(id));
    }
  }
}
