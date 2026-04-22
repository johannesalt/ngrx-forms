import {
  AfterViewInit,
  booleanAttribute,
  computed,
  Directive,
  effect,
  EffectCleanupFn,
  ElementRef,
  HostListener,
  inject,
  Injector,
  input,
  linkedSignal,
  OnInit,
  untracked,
  WritableSignal,
} from '@angular/core';
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
export class NgrxFormControlDirective<TState, TView = TState> implements AfterViewInit, OnInit {
  private readonly injector = inject(Injector);

  private readonly store = inject(Store, { optional: true });

  /**
   * The DOM element hosting this field.
   */
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);

  /**
   * A signal indicating whether focus tracking is enabled.
   */
  public readonly focusTrackingEnabled = input(false, { alias: 'ngrxEnableFocusTracking', transform: booleanAttribute });

  /**
   * A signal containing the current state for the bound control.
   */
  public readonly state = input.required<FormControlState<NgrxFormControlValueType<TState>>>({ alias: 'ngrxFormControlState' });

  /**
   * A signal indicating when to sync the view to the state.
   */
  public readonly updateOn = input(NGRX_UPDATE_ON_TYPE.CHANGE, { alias: 'ngrxUpdateOn' });

  /**
   * A signal containing the value converter.
   */
  public readonly valueConverter = input(NgrxValueConverters.default<any>(), { alias: 'ngrxValueConverter' });

  /**
   * A signal containing the control's value.s
   */
  public readonly controlValue = this.controlValueSignal();

  /**
   * A signal containing the errors of this field and its descendants.
   */
  public readonly errors = computed(() => {
    const { errors } = this.state();
    return errors;
  });

  /**
   * A signal containing a value used by the CDK to set the intial focus.
   */
  public readonly focusRegionStart = computed(() => {
    const isFocused = this.isFocused();
    return isFocused ? '' : null;
  });

  /**
   * A signal containing the unique Id of the control.
   */
  public readonly id = computed(() => {
    const { id } = this.state();
    return id;
  });

  /**
   * A signal indicating whether the controls's value has been changed by user.
   */
  public readonly isDirty = computed(() => {
    const { isDirty } = this.state();
    return isDirty;
  });

  /**
   * A signal indicating whether the control is currently disabled.
   */
  public readonly isDisabled = computed(() => {
    const { isDisabled } = this.state();
    return isDisabled;
  });

  /**
   * A signal indicating whether the control is currently enabled.
   */
  public readonly isEnabled = computed(() => {
    const { isEnabled } = this.state();
    return isEnabled;
  });

  /**
   * A signal indicating whether the control is focused.
   */
  public readonly isFocused = computed(() => {
    const { isFocused } = this.state();
    return isFocused;
  });

  /**
   * A signal indicating whether the controls's value is currently invalid.
   */
  public readonly isInvalid = computed(() => {
    const { isInvalid } = this.state();
    return isInvalid;
  });

  /**
   * A signal indicating the control value has not been changed by the user.
   */
  public readonly isPristine = computed(() => {
    const { isPristine } = this.state();
    return isPristine;
  });

  /**
   * A signal indicating whether the control is touched by the user.
   */
  public readonly isTouched = computed(() => {
    const { isTouched } = this.state();
    return isTouched;
  });

  /**
   * A signal indicating whether the control is NOT touched by the user.
   */
  public readonly isUntouched = computed(() => {
    const { isUntouched } = this.state();
    return isUntouched;
  });

  /**
   * A signal indicating whether the control's value is currently valid.
   */
  public readonly isValid = computed(() => {
    const { isValid } = this.state();
    return isValid;
  });

  /**
   * A signal indicating whether there are any validators still pending for the control.
   */
  public readonly isValidationPending = computed(() => {
    const { isValidationPending } = this.state();
    return isValidationPending;
  });

  /**
   * Set the focus depending on the state.
   */
  public readonly setFocusDependingOnState = effect(() => {
    const isFocused = this.isFocused();

    const focusTrackingEnabled = this.focusTrackingEnabled();
    if (!focusTrackingEnabled) {
      return;
    }

    if (isFocused) {
      this.element.nativeElement.focus();
    } else {
      this.element.nativeElement.blur();
    }
  });

  /**
   * A signal containing the view value.
   */
  public readonly viewValue = this.viewValueSignal();

  private viewAdapter: FormViewAdapter;

  constructor() {
    const valueAccessors = inject<ControlValueAccessor[]>(NG_VALUE_ACCESSOR, { self: true, optional: true }) ?? [];
    if (valueAccessors.length > 1) {
      throw new Error('More than one custom control value accessor matches!');
    }

    const viewAdapters = inject<FormViewAdapter[]>(NGRX_FORM_VIEW_ADAPTER, { self: true, optional: true }) ?? [];
    this.viewAdapter = valueAccessors.length > 0 ? new ControlValueAccessorAdapter(valueAccessors[0]) : selectViewAdapter(viewAdapters);
  }

  protected dispatchAction(action: Actions<NgrxFormControlValueType<TState>>) {
    if (this.store == null) {
      throw new Error('Store must be present in order to dispatch actions!');
    }

    this.store.dispatch(action);
  }

  private dispatchSetValueAction() {
    const { id, value } = untracked(this.state);

    const controlValue = untracked(this.controlValue);
    if (controlValue !== value) {
      this.dispatchAction(new SetValueAction(id, controlValue as NgrxFormControlValueType<TState>));
      this.markAsDirty();
    }
  }

  /**
   * @inheritdoc
   */
  public ngOnInit() {
    if (!this.state()) {
      throw new Error('The form state must not be undefined!');
    }

    this.viewAdapter.setOnChangeCallback(this.setViewValue.bind(this));
    this.viewAdapter.setOnTouchedCallback(this.markAsTouched.bind(this));
  }

  /**
   * @inheritdoc
   */
  public ngAfterViewInit() {
    const createEffect = (fn: EffectCleanupFn) => effect(fn, { injector: this.injector });

    // Some controls depdend on child elements for setting the value (e.g. select).
    createEffect(() => {
      this.id(); // Additional trigger

      const value = this.viewValue();
      this.viewAdapter.setViewValue(value);
    });

    createEffect(() => {
      this.id(); // Additional trigger

      const isDisabled = this.isDisabled();
      if (!this.viewAdapter.setIsDisabled) {
        return;
      }

      this.viewAdapter.setIsDisabled(isDisabled);
    });
  }

  /**
   * Sets the focus status of the field to `true`.
   */
  @HostListener('focusin')
  public focus() {
    const focusTrackingEnabled = untracked(this.focusTrackingEnabled);
    if (!focusTrackingEnabled) {
      return;
    }

    const id = untracked(this.id);
    const isFocused = untracked(this.isFocused);
    if (!isFocused) {
      this.dispatchAction(new FocusAction(id));
    }
  }

  /**
   * Sets the focus status of the field to `false`.
   */
  @HostListener('focusout')
  public unfocus() {
    const focusTrackingEnabled = untracked(this.focusTrackingEnabled);
    if (!focusTrackingEnabled) {
      return;
    }

    const id = untracked(this.id);
    const isFocused = untracked(this.isFocused);
    if (isFocused) {
      this.dispatchAction(new UnfocusAction(id));
    }
  }

  /**
   * Sets the dirty status of the field to `true`.
   */
  private markAsDirty() {
    const { id, isPristine } = this.state();
    if (isPristine) {
      this.dispatchAction(new MarkAsDirtyAction(id));
    }
  }

  /**
   * Sets the touched status of the field to `true`.
   */
  private markAsTouched() {
    const { id, isTouched } = this.state();
    const updateOn = this.updateOn();

    if (!isTouched && updateOn !== NGRX_UPDATE_ON_TYPE.NEVER) {
      this.dispatchAction(new MarkAsTouchedAction(id));
    }

    if (updateOn === NGRX_UPDATE_ON_TYPE.BLUR) {
      this.dispatchSetValueAction();
    }
  }

  /**
   * Sets the view value.
   * @param {TView} viewValue New value.
   */
  private setViewValue(viewValue: TView) {
    this.viewValue.set(viewValue);

    const updateOn = this.updateOn();
    if (updateOn === NGRX_UPDATE_ON_TYPE.CHANGE) {
      this.dispatchSetValueAction();
    }
  }

  /**
   * Creates a linked signal for the control value.
   */
  private controlValueSignal(): WritableSignal<TState> {
    const controlValue = linkedSignal({
      computation: (controlValue) => controlValue,
      equal: (a, b) => a === b,
      source: () => {
        const { value } = this.state();
        return value;
      },
    });

    return controlValue;
  }

  /**
   * Creates a linked signal for the view value.
   */
  private viewValueSignal(): WritableSignal<TView> {
    const viewValue = linkedSignal({
      computation: (viewValue) => viewValue,
      equal: (a, b) => a === b,
      source: () => {
        const value = this.controlValue();

        const converter = this.valueConverter();
        if (converter) {
          return converter.convertStateToViewValue(value);
        }

        return value;
      },
    });

    const { set, update } = viewValue;
    viewValue.set = (newValue) => {
      set(newValue);
      untracked(() => this.updateControlValue());
    };

    viewValue.update = (updateFn) => {
      update(updateFn);
      untracked(() => this.updateControlValue());
    };

    return viewValue;
  }

  /**
   * Updates the control value.
   */
  private updateControlValue(): void {
    const viewValue = this.viewValue();

    const converter = this.valueConverter();
    this.controlValue.set(converter ? converter.convertViewToStateValue(viewValue) : viewValue);
  }
}
