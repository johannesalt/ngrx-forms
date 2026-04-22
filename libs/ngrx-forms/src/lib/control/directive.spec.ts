import { Component, ElementRef, input, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Mock, MockInstance } from 'vitest';
import { FocusAction, MarkAsDirtyAction, MarkAsTouchedAction, SetValueAction, UnfocusAction } from '../actions';
import { FormActionDispatcher, NGRX_FORM_ACTION_DISPATCHER } from '../dispatcher';
import { createFormControlState } from '../state';
import { FormViewAdapter, NGRX_FORM_VIEW_ADAPTER } from '../view-adapter/view-adapter';
import { NGRX_UPDATE_ON_TYPE, NgrxFormControlDirective } from './directive';
import { NgrxValueConverter, NgrxValueConverters } from './value-converter';

const FORM_CONTROL_ID = 'test ID';
const INITIAL_FORM_CONTROL_VALUE = 'value';
const INITIAL_STATE = createFormControlState<string>(FORM_CONTROL_ID, INITIAL_FORM_CONTROL_VALUE);

@Component({
  imports: [NgrxFormControlDirective],
  template: `
    <input
      #el
      type="text"
      [ngrxEnableFocusTracking]="enableFocusTracking()"
      [ngrxFormControlState]="state()"
      [ngrxUpdateOn]="updateOn()"
      [ngrxValueConverter]="valueConverter()"
    />
  `,
})
export class TestComponent {
  public readonly element = viewChild<ElementRef<HTMLInputElement>>('el');

  public readonly state = input(INITIAL_STATE);

  public readonly enableFocusTracking = input<boolean>(false);

  public readonly updateOn = input(NGRX_UPDATE_ON_TYPE.CHANGE);

  public readonly valueConverter = input(NgrxValueConverters.default<any>());
}

describe(NgrxFormControlDirective, () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  let setIsDisabled: Mock<(isDisabled: boolean) => void>;
  beforeEach(() => {
    setIsDisabled = vi.fn();
  });

  let setOnChangeCallback: Mock<(fn: (value: any) => void) => void>;
  let onChange: (value: any) => void;
  beforeEach(() => {
    setOnChangeCallback = vi.fn((fn) => {
      onChange = (value) => {
        fn(value);
        fixture.detectChanges();
      };
    });
  });

  let setOnTouchedCallback: Mock<(fn: () => void) => void>;
  let onTouched: () => void;
  beforeEach(() => {
    setOnTouchedCallback = vi.fn((fn) => {
      onTouched = () => {
        fn();
        fixture.detectChanges();
      };
    });
  });

  let setViewValue: Mock<(value: any) => void>;
  beforeEach(() => {
    setViewValue = vi.fn();
  });

  let viewAdapter: FormViewAdapter;
  beforeEach(() => {
    viewAdapter = {
      setIsDisabled: undefined,
      setOnChangeCallback: setOnChangeCallback,
      setOnTouchedCallback: setOnTouchedCallback,
      setViewValue: setViewValue,
    };
  });

  let dispatcher: FormActionDispatcher;
  beforeEach(() => {
    dispatcher = {
      focus: vi.fn(() => null),
      markAsDirty: vi.fn(() => null),
      markAsPristine: vi.fn(() => null),
      markAsSubmitted: vi.fn(() => null),
      markAsTouched: vi.fn(() => null),
      markAsUntouched: vi.fn(() => null),
      reset: vi.fn(() => null),
      setValue: vi.fn(() => null),
      unfocus: vi.fn(() => null),
    };
  });

  describe('ViewAdapter integration', () => {
    beforeEach(() => {
      TestBed.overrideDirective(NgrxFormControlDirective, {
        set: {
          providers: [
            { provide: NGRX_FORM_ACTION_DISPATCHER, useValue: dispatcher },
            { provide: NGRX_FORM_VIEW_ADAPTER, useValue: viewAdapter, multi: true },
          ],
        },
      });
    });

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [TestComponent],
      }).compileComponents();
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(TestComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    beforeEach(() => {
      setIsDisabled.mockClear();
      setViewValue.mockClear();
    });

    describe('writing values and dispatching value and dirty actions', () => {
      test('should write the value when the state changes', () => {
        const newValue = 'new value';

        fixture.componentRef.setInput('state', { ...INITIAL_STATE, value: newValue });
        fixture.detectChanges();

        expect(setViewValue).toHaveBeenCalledWith(newValue);
      });

      test('should not write the value when the state value does not change', () => {
        fixture.componentRef.setInput('state', INITIAL_STATE);
        fixture.detectChanges();

        expect(setViewValue).not.toHaveBeenCalled();
      });

      test('should not write the value when the state value is the same as the view value', () => {
        const newValue = 'new value';
        onChange(newValue);

        setViewValue.mockClear();

        fixture.componentRef.setInput('state', { ...INITIAL_STATE, value: newValue });
        fixture.detectChanges();

        expect(setViewValue).not.toHaveBeenCalled();
      });

      test('should write the value when the state value does not change but the id does', () => {
        fixture.componentRef.setInput('state', { ...INITIAL_STATE, id: `${FORM_CONTROL_ID}1` });
        fixture.detectChanges();

        expect(setViewValue).toHaveBeenCalledWith(INITIAL_STATE.value);
      });

      test('should not throw if id changes and new state is disabled but adapter does not support disabling', () => {
        const fn = () => {
          fixture.componentRef.setInput('state', { ...INITIAL_STATE, id: `${FORM_CONTROL_ID}1`, isDisabled: true, isEnabled: false });
          fixture.detectChanges();
        };
        expect(fn).not.toThrow();
      });

      test('should write the value when the state value does not change but the id does after a new view value was reported', () => {
        const newValue = 'new value';
        onChange(newValue);

        setViewValue.mockClear();

        fixture.componentRef.setInput('state', { ...INITIAL_STATE, id: `${FORM_CONTROL_ID}1`, value: newValue });
        fixture.detectChanges();

        expect(setViewValue).toHaveBeenCalledWith(newValue);
      });

      test('should write the value when the state value does not change but the id does after an undefined view value was reported', () => {
        const newValue = undefined as any;
        onChange(newValue);

        setViewValue.mockClear();

        fixture.componentRef.setInput('state', { ...INITIAL_STATE, id: `${FORM_CONTROL_ID}1`, value: newValue });
        fixture.detectChanges();

        expect(setViewValue).toHaveBeenCalledWith(newValue);
      });

      test(`should dispatch a ${SetValueAction} if the view value changes`, () => {
        const newValue = 'new value';
        onChange(newValue);

        expect(dispatcher.setValue).toHaveBeenCalledWith(INITIAL_STATE.id, newValue);
      });

      test(`should not dispatch a ${SetValueAction} if the view value is the same as the state`, () => {
        onChange(INITIAL_STATE.value);

        expect(dispatcher.setValue).not.toHaveBeenCalled();
      });

      test(`should dispatch a ${MarkAsDirtyAction} if the view value changes when the state is not marked as dirty`, () => {
        const newValue = 'new value';
        onChange(newValue);

        expect(dispatcher.markAsDirty).toHaveBeenCalledWith(INITIAL_STATE.id);
      });

      test(`should not dispatch a ${MarkAsDirtyAction} if the view value changes when the state is marked as dirty`, () => {
        fixture.componentRef.setInput('state', { ...INITIAL_STATE, isDirty: true, isPristine: false });
        fixture.detectChanges();

        const newValue = 'new value';
        onChange(newValue);

        expect(dispatcher.markAsDirty).not.toHaveBeenCalledWith(INITIAL_STATE.id);
      });

      test('should write the value when the state changes to the same value that was reported from the view before', () => {
        const newValue = 'new value';
        onChange(newValue);

        fixture.componentRef.setInput('state', { ...INITIAL_STATE, value: newValue });
        fixture.detectChanges();

        fixture.componentRef.setInput('state', INITIAL_STATE);
        fixture.detectChanges();

        setViewValue.mockClear();

        fixture.componentRef.setInput('state', { ...INITIAL_STATE, value: newValue });
        fixture.detectChanges();

        expect(setViewValue).toHaveBeenCalledWith(newValue);
      });

      test('should correctly set the initial values if a value converter is set after the initial state', () => {
        const convertedValue = ['A'];

        fixture.componentRef.setInput('valueConverter', <NgrxValueConverter<any, any>>{
          convertStateToViewValue: () => convertedValue,
          convertViewToStateValue: (s) => s,
        });
        fixture.detectChanges();

        fixture.componentRef.setInput('state', { ...INITIAL_STATE, value: 'new value' });
        fixture.detectChanges();

        expect(setViewValue).toHaveBeenCalledWith(convertedValue);
      });
    });

    describe('touch handling', () => {
      test(`should dispatch a ${MarkAsTouchedAction} if the view adapter notifies and the state is not touched`, () => {
        onTouched();

        expect(dispatcher.markAsTouched).toHaveBeenCalledWith(INITIAL_STATE.id);
      });

      test(`should not dispatch a ${MarkAsTouchedAction} if the view adapter notifies and the state is touched`, () => {
        fixture.componentRef.setInput('state', { ...INITIAL_STATE, isTouched: true, isUntouched: false });
        fixture.detectChanges();

        onTouched();

        expect(dispatcher.markAsTouched).not.toHaveBeenCalledWith(INITIAL_STATE.id);
      });
    });

    describe('ngrxUpdateOn "blur"', () => {
      beforeEach(() => {
        fixture.componentRef.setInput('state', { ...INITIAL_STATE, isTouched: true, isUntouched: false });
        fixture.componentRef.setInput('updateOn', NGRX_UPDATE_ON_TYPE.BLUR);
        fixture.detectChanges();
      });

      test('should dispatch an action on blur if the view value has changed with ngrxUpdateOn "blur"', () => {
        const newValue = 'new value';
        onChange(newValue);
        onTouched();

        expect(dispatcher.setValue).toHaveBeenCalledWith(INITIAL_STATE.id, newValue);
      });

      test('should not dispatch an action on blur if the view value has not changed with ngrxUpdateOn "blur"', () => {
        onTouched();

        expect(dispatcher.setValue).not.toHaveBeenCalled();
      });

      test('should not dispatch an action if the view value changes with ngrxUpdateOn "blur"', () => {
        const newValue = 'new value';
        onChange(newValue);

        expect(dispatcher.setValue).not.toHaveBeenCalled();
      });

      test('should not write the value when the state value does not change', () => {
        const newValue = 'new value';
        onChange(newValue);

        setViewValue.mockClear();

        fixture.componentRef.setInput('state', { ...INITIAL_STATE, value: newValue });
        fixture.detectChanges();

        expect(setViewValue).not.toHaveBeenCalled();
      });
    });

    describe('ngrxUpdateOn "never"', () => {
      beforeEach(() => {
        fixture.componentRef.setInput('updateOn', NGRX_UPDATE_ON_TYPE.NEVER);
        fixture.detectChanges();
      });

      test('should not dispatch any action even if the view value changed', () => {
        const newValue = 'new value';
        onChange(newValue);
        onTouched();

        expect(dispatcher.focus).not.toHaveBeenCalled();
        expect(dispatcher.markAsDirty).not.toHaveBeenCalled();
        expect(dispatcher.markAsPristine).not.toHaveBeenCalled();
        expect(dispatcher.markAsSubmitted).not.toHaveBeenCalled();
        expect(dispatcher.markAsTouched).not.toHaveBeenCalled();
        expect(dispatcher.markAsUntouched).not.toHaveBeenCalled();
        expect(dispatcher.reset).not.toHaveBeenCalled();
        expect(dispatcher.setValue).not.toHaveBeenCalled();
        expect(dispatcher.unfocus).not.toHaveBeenCalled();
      });
    });

    describe('enabling/disabling', () => {
      test('should enable the state if disabled', () => {
        fixture.componentRef.setInput('state', { ...INITIAL_STATE, isEnabled: false, isDisabled: true });
        fixture.detectChanges();

        viewAdapter.setIsDisabled = setIsDisabled;

        fixture.componentRef.setInput('state', { ...INITIAL_STATE });
        fixture.detectChanges();

        expect(setIsDisabled).toHaveBeenCalledWith(false);
      });

      test('should not enable the state if enabled', () => {
        viewAdapter.setIsDisabled = setIsDisabled;

        fixture.componentRef.setInput('state', { ...INITIAL_STATE });
        fixture.detectChanges();

        expect(setIsDisabled).not.toHaveBeenCalled();
      });

      test('should disable the state if enabled', () => {
        viewAdapter.setIsDisabled = setIsDisabled;

        fixture.componentRef.setInput('state', { ...INITIAL_STATE, isEnabled: false, isDisabled: true });
        fixture.detectChanges();

        expect(setIsDisabled).toHaveBeenCalledWith(true);
      });

      test('should not disable the state if disabled', () => {
        fixture.componentRef.setInput('state', { ...INITIAL_STATE, isEnabled: false, isDisabled: true });
        fixture.detectChanges();

        viewAdapter.setIsDisabled = setIsDisabled;

        fixture.componentRef.setInput('state', { ...INITIAL_STATE, isEnabled: false, isDisabled: true });
        fixture.detectChanges();

        expect(setIsDisabled).not.toHaveBeenCalled();
      });

      test('should not throw if setIsDisabled is not defined', () => {
        const fn = () => {
          fixture.componentRef.setInput('state', { ...INITIAL_STATE, isEnabled: false, isDisabled: true });
          fixture.detectChanges();
        };
        expect(fn).not.toThrow();
      });
    });

    describe('value conversion', () => {
      const VIEW_VALUE = new Date(0);
      const STATE_VALUE = '1970-01-01T00:00:00.000Z';

      beforeEach(() => {
        fixture.componentRef.setInput('valueConverter', NgrxValueConverters.dateToISOString);
        fixture.detectChanges();
      });

      test('should convert the state value when the state changes', () => {
        fixture.componentRef.setInput('state', { ...INITIAL_STATE, value: STATE_VALUE });
        fixture.detectChanges();

        expect(setViewValue).toHaveBeenCalledWith(VIEW_VALUE);
      });

      test('should convert the view value if it changes', () => {
        onChange(VIEW_VALUE);

        expect(dispatcher.setValue).toHaveBeenCalledWith(INITIAL_STATE.id, STATE_VALUE);
      });

      test('should not write the value when the state value does not change with conversion', () => {
        fixture.componentRef.setInput('state', { ...INITIAL_STATE, value: STATE_VALUE });
        fixture.detectChanges();

        setViewValue.mockClear();

        fixture.componentRef.setInput('state', { ...INITIAL_STATE, value: STATE_VALUE });
        fixture.detectChanges();

        expect(setViewValue).not.toHaveBeenCalled();
      });

      test('should not dispatch an action if the view value is the same as the state with conversion', () => {
        fixture.componentRef.setInput('state', { ...INITIAL_STATE, value: STATE_VALUE });
        fixture.detectChanges();

        onChange(VIEW_VALUE);

        expect(dispatcher.focus).not.toHaveBeenCalled();
        expect(dispatcher.markAsDirty).not.toHaveBeenCalled();
        expect(dispatcher.markAsPristine).not.toHaveBeenCalled();
        expect(dispatcher.markAsSubmitted).not.toHaveBeenCalled();
        expect(dispatcher.markAsTouched).not.toHaveBeenCalled();
        expect(dispatcher.markAsUntouched).not.toHaveBeenCalled();
        expect(dispatcher.reset).not.toHaveBeenCalled();
        expect(dispatcher.setValue).not.toHaveBeenCalled();
        expect(dispatcher.unfocus).not.toHaveBeenCalled();
      });
    });

    describe('focus tracking', () => {
      let blur: MockInstance<() => void>;
      let focus: MockInstance<() => void>;
      let nativeElement: HTMLInputElement;
      beforeEach(() => {
        const element = component.element();
        if (!element) {
          throw 'Element cannot be undefined';
        }

        nativeElement = element.nativeElement;
      });

      describe('is enabled', () => {
        beforeEach(() => {
          fixture.componentRef.setInput('enableFocusTracking', true);
          fixture.detectChanges();
        });

        beforeEach(() => {
          blur = vi.spyOn(nativeElement, 'blur');
          focus = vi.spyOn(nativeElement, 'focus');
        });

        test('should focus the element if state is focused initially', () => {
          fixture.componentRef.setInput('state', { ...INITIAL_STATE, isFocused: true, isUnfocused: false });
          fixture.detectChanges();

          expect(focus).toHaveBeenCalled();
        });

        test('should blur the element if state is unfocused initially', () => {
          fixture.componentRef.setInput('state', { ...INITIAL_STATE, isFocused: true, isUnfocused: false });
          fixture.detectChanges();

          fixture.componentRef.setInput('state', { ...INITIAL_STATE, id: `${INITIAL_STATE.id}1` });
          fixture.detectChanges();

          expect(blur).toHaveBeenCalled();
        });

        test('should focus the element if state becomes focused', () => {
          expect(focus).not.toHaveBeenCalled();

          fixture.componentRef.setInput('state', { ...INITIAL_STATE, isFocused: true, isUnfocused: false });
          fixture.detectChanges();

          expect(focus).toHaveBeenCalled();
        });

        test('should blur the element if state becomes unfocused', () => {
          fixture.componentRef.setInput('state', { ...INITIAL_STATE, isFocused: true, isUnfocused: false });
          fixture.detectChanges();

          expect(blur).not.toHaveBeenCalled();

          fixture.componentRef.setInput('state', INITIAL_STATE);
          fixture.detectChanges();

          expect(blur).toHaveBeenCalled();
        });

        test('should not focus the element if state is and was focused', () => {
          fixture.componentRef.setInput('state', { ...INITIAL_STATE, isFocused: true, isUnfocused: false });
          fixture.detectChanges();

          expect(focus).toHaveBeenCalledTimes(1);

          fixture.componentRef.setInput('state', { ...INITIAL_STATE, isFocused: true, isUnfocused: false });
          fixture.detectChanges();

          expect(focus).toHaveBeenCalledTimes(1);
        });

        test(`should dispatch a ${FocusAction} when element becomes focused and state is not focused`, () => {
          nativeElement.focus();

          expect(dispatcher.focus).toHaveBeenCalledWith(INITIAL_STATE.id);
        });

        test('should not dispatch an action when element becomes focused and state is focused', () => {
          fixture.componentRef.setInput('state', { ...INITIAL_STATE, isFocused: true, isUnfocused: false });
          fixture.detectChanges();

          nativeElement.focus();

          expect(dispatcher.focus).not.toHaveBeenCalled();
        });

        test(`should dispatch an ${UnfocusAction} when element becomes unfocused and state is focused`, () => {
          fixture.componentRef.setInput('state', { ...INITIAL_STATE, isFocused: true, isUnfocused: false });
          fixture.detectChanges();

          nativeElement.focus();
          nativeElement.blur();

          expect(dispatcher.unfocus).toHaveBeenCalledWith(INITIAL_STATE.id);
        });

        test('should not dispatch an action when element becomes unfocused and state is unfocused', () => {
          nativeElement.focus();
          nativeElement.blur();

          expect(dispatcher.unfocus).not.toHaveBeenCalledWith(INITIAL_STATE.id);
        });

        test('should add the cdk focus attribute if state is focused', () => {
          fixture.componentRef.setInput('state', { ...INITIAL_STATE, isFocused: true, isUnfocused: false });
          fixture.detectChanges();

          const focusRegionStart = nativeElement.getAttribute('cdk-focus-region-start');
          expect(focusRegionStart).toBe('');
        });

        test('should remove the cdk focus attribute if state is unfocused', () => {
          const focusRegionStart = nativeElement.getAttribute('cdk-focus-region-start');
          expect(focusRegionStart).toBe(null);
        });
      });

      describe('is disabled', () => {
        beforeEach(() => {
          blur = vi.spyOn(nativeElement, 'blur');
          focus = vi.spyOn(nativeElement, 'focus');
        });

        test('should not focus the element initially', () => {
          fixture.componentRef.setInput('state', { ...INITIAL_STATE, isFocused: true, isUnfocused: false });
          fixture.detectChanges();

          expect(focus).not.toHaveBeenCalled();
        });

        test('should not blur the element initially', () => {
          expect(blur).not.toHaveBeenCalled();
        });

        test('should not focus the element if state becomes focused', () => {
          fixture.componentRef.setInput('state', { ...INITIAL_STATE, isFocused: true, isUnfocused: false });
          fixture.detectChanges();

          expect(focus).not.toHaveBeenCalled();
        });

        test('should not blur the element if state becomes unfocused', () => {
          fixture.componentRef.setInput('state', { ...INITIAL_STATE, isFocused: true, isUnfocused: false });
          fixture.detectChanges();

          fixture.componentRef.setInput('state', INITIAL_STATE);
          fixture.detectChanges();

          expect(blur).not.toHaveBeenCalled();
        });

        test(`should not dispatch an action when element becomes focused and state is not focused`, () => {
          nativeElement.focus();

          expect(dispatcher.focus).not.toHaveBeenCalled();
        });

        test('should not dispatch an action when element becomes focused and state is focused', () => {
          fixture.componentRef.setInput('state', { ...INITIAL_STATE, isFocused: true, isUnfocused: false });
          fixture.detectChanges();

          nativeElement.focus();

          expect(dispatcher.focus).not.toHaveBeenCalled();
        });

        test(`should not dispatch an action when element becomes unfocused and state is focused`, () => {
          fixture.componentRef.setInput('state', { ...INITIAL_STATE, isFocused: true, isUnfocused: false });
          fixture.detectChanges();

          nativeElement.focus();
          nativeElement.blur();

          expect(dispatcher.unfocus).not.toHaveBeenCalled();
        });

        test('should not dispatch an action when element becomes unfocused and state is unfocused', () => {
          nativeElement.focus();
          nativeElement.blur();

          expect(dispatcher.unfocus).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe('ControlValueAccessor integration', () => {
    let registerOnChange: Mock<(fn: (value: any) => void) => void>;
    beforeEach(() => {
      registerOnChange = vi.fn();
    });

    let registerOnTouched: Mock<(fn: () => void) => void>;
    beforeEach(() => {
      registerOnTouched = vi.fn();
    });

    let setDisabledState: Mock<(isDisabled: boolean) => void>;
    beforeEach(() => {
      setDisabledState = vi.fn();
    });

    let writeValue: Mock<(value: any) => void>;
    beforeEach(() => {
      writeValue = vi.fn();
    });

    let controlValueAccessor: ControlValueAccessor;
    beforeEach(() => {
      controlValueAccessor = {
        registerOnChange: registerOnChange,
        registerOnTouched: registerOnTouched,
        setDisabledState: undefined,
        writeValue: writeValue,
      };
    });

    beforeEach(() => {
      TestBed.overrideDirective(NgrxFormControlDirective, {
        set: {
          providers: [
            { provide: NGRX_FORM_ACTION_DISPATCHER, useValue: dispatcher },
            { provide: NG_VALUE_ACCESSOR, useValue: controlValueAccessor, multi: true },
          ],
        },
      });
    });

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [TestComponent],
      }).compileComponents();
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(TestComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    test('should adapt a control value accessor to a form view adapter if no form view adapter is provided', () => {
      controlValueAccessor.setDisabledState = setDisabledState;

      fixture.componentRef.setInput('state', { ...INITIAL_STATE, isDisabled: true, isEnabled: false });
      fixture.detectChanges();

      expect(registerOnChange).toHaveBeenCalled();
      expect(registerOnTouched).toHaveBeenCalled();
      expect(setDisabledState).toHaveBeenCalledWith(true);
      expect(writeValue).toHaveBeenCalledWith(INITIAL_STATE.value);
    });

    test('should adapt a control value accessor without disabling support', () => {
      const fn = () => {
        fixture.componentRef.setInput('state', { ...INITIAL_STATE, isDisabled: true, isEnabled: false });
        fixture.detectChanges();
      };
      expect(fn).not.toThrow();
    });
  });

  describe('Multiple ControlValueAccessors', () => {
    let controlValueAccessor1: ControlValueAccessor;
    beforeEach(() => {
      controlValueAccessor1 = {
        registerOnChange: vi.fn(),
        registerOnTouched: vi.fn(),
        setDisabledState: vi.fn(),
        writeValue: vi.fn(),
      };
    });

    let controlValueAccessor2: ControlValueAccessor;
    beforeEach(() => {
      controlValueAccessor2 = {
        registerOnChange: vi.fn(),
        registerOnTouched: vi.fn(),
        setDisabledState: vi.fn(),
        writeValue: vi.fn(),
      };
    });

    beforeEach(() => {
      TestBed.overrideDirective(NgrxFormControlDirective, {
        set: {
          providers: [
            { provide: NGRX_FORM_ACTION_DISPATCHER, useValue: dispatcher },
            { provide: NG_VALUE_ACCESSOR, useValue: controlValueAccessor1, multi: true },
            { provide: NG_VALUE_ACCESSOR, useValue: controlValueAccessor2, multi: true },
          ],
        },
      });
    });

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [TestComponent],
      }).compileComponents();
    });

    test('should throw if more than one control value accessor is provided', () => {
      const fn = () => {
        const fixture = TestBed.createComponent(TestComponent);
        fixture.detectChanges();
      };
      expect(fn).toThrow();
    });
  });
});
