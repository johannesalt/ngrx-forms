import { Component, ElementRef, viewChild } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Action, ActionsSubject } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { Mock, MockInstance } from 'vitest';
import { FocusAction, MarkAsDirtyAction, MarkAsTouchedAction, SetValueAction, UnfocusAction } from '../actions';
import { FormControlState, createFormControlState } from '../state';
import { FormViewAdapter, NGRX_FORM_VIEW_ADAPTER } from '../view-adapter/view-adapter';
import { NGRX_UPDATE_ON_TYPE, NgrxFormControlDirective } from './directive';
import { NgrxValueConverters } from './value-converter';

const FORM_CONTROL_ID = 'test ID';
const INITIAL_FORM_CONTROL_VALUE = 'value';
const INITIAL_STATE = createFormControlState<string>(FORM_CONTROL_ID, INITIAL_FORM_CONTROL_VALUE);

@Component({
  imports: [NgrxFormControlDirective],
  template: `
    <input
      #el
      type="text"
      [ngrxEnableFocusTracking]="enableFocusTracking"
      [ngrxFormControlState]="state"
      [ngrxUpdateOn]="updateOn"
      [ngrxValueConverter]="valueConverter"
    />
  `,
})
export class TestComponent {
  public readonly element = viewChild<ElementRef<HTMLInputElement>>('el');

  public enableFocusTracking = false;

  public state: Partial<FormControlState<string>> | null | undefined = INITIAL_STATE;

  public updateOn = NGRX_UPDATE_ON_TYPE.CHANGE;

  public valueConverter = NgrxValueConverters.default<any>();
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
    setOnChangeCallback = vi.fn().mockImplementation((fn) => (onChange = fn));
  });

  let setOnTouchedCallback: Mock<(fn: () => void) => void>;
  let onTouched: () => void;
  beforeEach(() => {
    setOnTouchedCallback = vi.fn().mockImplementation((fn) => (onTouched = fn));
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

  describe('ViewAdapter integration', () => {
    beforeEach(() => {
      TestBed.overrideDirective(NgrxFormControlDirective, {
        set: {
          providers: [{ multi: true, provide: NGRX_FORM_VIEW_ADAPTER, useValue: viewAdapter }],
        },
      });
    });

    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [TestComponent],
        providers: [provideMockStore()],
      }).compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(TestComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    beforeEach(() => {
      setIsDisabled.mockClear();
      setViewValue.mockClear();
    });

    let next: MockInstance<(action: Action) => void>;
    beforeEach(() => {
      const actions = TestBed.inject(ActionsSubject);
      next = vi.spyOn(actions, 'next');
    });

    test('should throw if the provided state is not defined', () => {
      const fn = () => {
        component.state = undefined;
        fixture.detectChanges();
      };
      expect(fn).toThrowError();
    });

    describe('writing values and dispatching value and dirty actions', () => {
      test('should write the value when the state changes', () => {
        const newValue = 'new value';

        component.state = { ...INITIAL_STATE, value: newValue };
        fixture.detectChanges();

        expect(setViewValue).toHaveBeenCalledWith(newValue);
      });

      test('should not write the value when the state value does not change', () => {
        component.state = INITIAL_STATE;
        fixture.detectChanges();

        expect(setViewValue).not.toHaveBeenCalled();
      });

      test('should not write the value when the state value is the same as the view value', () => {
        const newValue = 'new value';
        onChange(newValue);

        setViewValue.mockClear();

        component.state = { ...INITIAL_STATE, value: newValue };
        fixture.detectChanges();

        expect(setViewValue).not.toHaveBeenCalled();
      });

      test('should write the value when the state value does not change but the id does', () => {
        component.state = { ...INITIAL_STATE, id: `${FORM_CONTROL_ID}1` };
        fixture.detectChanges();

        expect(setViewValue).toHaveBeenCalledWith(INITIAL_STATE.value);
      });

      test('should not throw if id changes and new state is disabled but adapter does not support disabling', () => {
        const fn = () => {
          component.state = { ...INITIAL_STATE, id: `${FORM_CONTROL_ID}1`, isDisabled: true, isEnabled: false };
          fixture.detectChanges();
        };
        expect(fn).not.toThrowError();
      });

      test('should write the value when the state value does not change but the id does after a new view value was reported', () => {
        const newValue = 'new value';
        onChange(newValue);

        setViewValue.mockClear();

        component.state = { ...INITIAL_STATE, id: `${FORM_CONTROL_ID}1`, value: newValue };
        fixture.detectChanges();

        expect(setViewValue).toHaveBeenCalledWith(newValue);
      });

      test('should write the value when the state value does not change but the id does after an undefined view value was reported', () => {
        const newValue = undefined as any;
        onChange(newValue);

        setViewValue.mockClear();

        component.state = { ...INITIAL_STATE, id: `${FORM_CONTROL_ID}1`, value: newValue };
        fixture.detectChanges();

        expect(setViewValue).toHaveBeenCalledWith(newValue);
      });

      test(`should dispatch a ${SetValueAction} if the view value changes`, () => {
        const newValue = 'new value';
        onChange(newValue);

        expect(next).toHaveBeenCalledWith(new SetValueAction(INITIAL_STATE.id, newValue));
      });

      test(`should not dispatch a ${SetValueAction} if the view value is the same as the state`, () => {
        onChange(INITIAL_STATE.value);

        expect(next).not.toHaveBeenCalled();
      });

      test(`should dispatch a ${MarkAsDirtyAction} if the view value changes when the state is not marked as dirty`, () => {
        const newValue = 'new value';
        onChange(newValue);

        expect(next).toHaveBeenCalledWith(new MarkAsDirtyAction(INITIAL_STATE.id));
      });

      test(`should not dispatch a ${MarkAsDirtyAction} if the view value changes when the state is marked as dirty`, () => {
        component.state = { ...INITIAL_STATE, isDirty: true, isPristine: false };
        fixture.detectChanges();

        const newValue = 'new value';
        onChange(newValue);

        expect(next).not.toHaveBeenCalledWith(new MarkAsDirtyAction(INITIAL_STATE.id));
      });

      test('should write the value when the state changes to the same value that was reported from the view before', () => {
        const newValue = 'new value';
        onChange(newValue);

        component.state = { ...INITIAL_STATE, value: newValue };
        fixture.detectChanges();

        component.state = INITIAL_STATE;
        fixture.detectChanges();

        setViewValue.mockClear();

        component.state = { ...INITIAL_STATE, value: newValue };
        fixture.detectChanges();

        expect(setViewValue).toHaveBeenCalledWith(newValue);
      });

      test('should correctly set the initial values if a value converter is set after the initial state', () => {
        const convertedValue = ['A'];

        component.valueConverter = {
          convertStateToViewValue: () => convertedValue,
          convertViewToStateValue: (s) => s,
        };
        fixture.detectChanges();

        component.state = { ...INITIAL_STATE, value: 'new value' };
        fixture.detectChanges();

        expect(setViewValue).toHaveBeenCalledWith(convertedValue);
      });
    });

    describe('touch handling', () => {
      test(`should dispatch a ${MarkAsTouchedAction} if the view adapter notifies and the state is not touched`, () => {
        onTouched();

        expect(next).toHaveBeenCalledWith(new MarkAsTouchedAction(INITIAL_STATE.id));
      });

      test(`should not dispatch a ${MarkAsTouchedAction} if the view adapter notifies and the state is touched`, () => {
        component.state = { ...INITIAL_STATE, isTouched: true, isUntouched: false };
        fixture.detectChanges();

        onTouched();

        expect(next).not.toHaveBeenCalledWith(new MarkAsTouchedAction(INITIAL_STATE.id));
      });
    });

    describe('ngrxUpdateOn "blur"', () => {
      beforeEach(() => {
        component.state = { ...INITIAL_STATE, isTouched: true, isUntouched: false };
        component.updateOn = NGRX_UPDATE_ON_TYPE.BLUR;
        fixture.detectChanges();
      });

      test('should dispatch an action on blur if the view value has changed with ngrxUpdateOn "blur"', () => {
        const newValue = 'new value';
        onChange(newValue);
        onTouched();

        expect(next).toHaveBeenCalledWith(new SetValueAction(INITIAL_STATE.id, newValue));
      });

      test('should not dispatch an action on blur if the view value has not changed with ngrxUpdateOn "blur"', () => {
        onTouched();

        expect(next).not.toHaveBeenCalled();
      });

      test('should not dispatch an action if the view value changes with ngrxUpdateOn "blur"', () => {
        const newValue = 'new value';
        onChange(newValue);

        expect(next).not.toHaveBeenCalled();
      });

      test('should not write the value when the state value does not change', () => {
        const newValue = 'new value';
        onChange(newValue);

        setViewValue.mockClear();

        component.state = { ...INITIAL_STATE };
        fixture.detectChanges();

        expect(setViewValue).not.toHaveBeenCalled();
      });
    });

    describe('ngrxUpdateOn "never"', () => {
      beforeEach(() => {
        component.updateOn = NGRX_UPDATE_ON_TYPE.NEVER;
        fixture.detectChanges();
      });

      test('should not dispatch any action even if the view value changed', () => {
        const newValue = 'new value';
        onChange(newValue);
        onTouched();

        expect(next).not.toHaveBeenCalled();
      });
    });

    describe('enabling/disabling', () => {
      test('should enable the state if disabled', () => {
        component.state = { ...INITIAL_STATE, isEnabled: false, isDisabled: true };
        fixture.detectChanges();

        viewAdapter.setIsDisabled = setIsDisabled;

        component.state = { ...INITIAL_STATE };
        fixture.detectChanges();

        expect(setIsDisabled).toHaveBeenCalledWith(false);
      });

      test('should not enable the state if enabled', () => {
        viewAdapter.setIsDisabled = setIsDisabled;

        component.state = { ...INITIAL_STATE };
        fixture.detectChanges();

        expect(setIsDisabled).not.toHaveBeenCalled();
      });

      test('should disable the state if enabled', () => {
        viewAdapter.setIsDisabled = setIsDisabled;

        component.state = { ...INITIAL_STATE, isEnabled: false, isDisabled: true };
        fixture.detectChanges();

        expect(setIsDisabled).toHaveBeenCalledWith(true);
      });

      test('should not disable the state if disabled', () => {
        component.state = { ...INITIAL_STATE, isEnabled: false, isDisabled: true };
        fixture.detectChanges();

        viewAdapter.setIsDisabled = setIsDisabled;

        component.state = { ...INITIAL_STATE, isEnabled: false, isDisabled: true };
        fixture.detectChanges();

        expect(setIsDisabled).not.toHaveBeenCalled();
      });

      test('should not throw if setIsDisabled is not defined', () => {
        const fn = () => {
          component.state = { ...INITIAL_STATE, isEnabled: false, isDisabled: true };
          fixture.detectChanges();
        };
        expect(fn).not.toThrow();
      });
    });

    describe('value conversion', () => {
      const VIEW_VALUE = new Date(0);
      const STATE_VALUE = '1970-01-01T00:00:00.000Z';

      beforeEach(() => {
        component.valueConverter = NgrxValueConverters.dateToISOString;
        fixture.detectChanges();
      });

      test('should convert the state value when the state changes', () => {
        component.state = { ...INITIAL_STATE, value: STATE_VALUE };
        fixture.detectChanges();

        expect(setViewValue).toHaveBeenCalledWith(VIEW_VALUE);
      });

      test('should convert the view value if it changes', () => {
        onChange(VIEW_VALUE);

        expect(next).toHaveBeenCalledWith(new SetValueAction(INITIAL_STATE.id, STATE_VALUE));
      });

      test('should not write the value when the state value does not change with conversion', () => {
        component.state = { ...INITIAL_STATE, value: STATE_VALUE };
        fixture.detectChanges();

        setViewValue.mockClear();

        component.state = { ...INITIAL_STATE, value: STATE_VALUE };
        fixture.detectChanges();

        expect(setViewValue).not.toHaveBeenCalled();
      });

      test('should not dispatch an action if the view value is the same as the state with conversion', () => {
        component.state = { ...INITIAL_STATE, value: STATE_VALUE };
        fixture.detectChanges();

        onChange(VIEW_VALUE);

        expect(next).not.toHaveBeenCalled();
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
          component.enableFocusTracking = true;
          fixture.detectChanges();
        });

        beforeEach(() => {
          blur = vi.spyOn(nativeElement, 'blur');
          focus = vi.spyOn(nativeElement, 'focus');
        });

        test('should focus the element if state is focused initially', () => {
          component.state = { ...INITIAL_STATE, isFocused: true, isUnfocused: false };
          fixture.detectChanges();

          expect(focus).toHaveBeenCalled();
        });

        test('should blur the element if state is unfocused initially', () => {
          component.state = { ...INITIAL_STATE, isFocused: true, isUnfocused: false };
          fixture.detectChanges();

          component.state = { ...INITIAL_STATE, id: `${INITIAL_STATE.id}1` };
          fixture.detectChanges();

          expect(blur).toHaveBeenCalled();
        });

        test('should focus the element if state becomes focused', () => {
          expect(focus).not.toHaveBeenCalled();

          component.state = { ...INITIAL_STATE, isFocused: true, isUnfocused: false };
          fixture.detectChanges();

          expect(focus).toHaveBeenCalled();
        });

        test('should blur the element if state becomes unfocused', () => {
          component.state = { ...INITIAL_STATE, isFocused: true, isUnfocused: false };
          fixture.detectChanges();

          expect(blur).not.toHaveBeenCalled();

          component.state = INITIAL_STATE;
          fixture.detectChanges();

          expect(blur).toHaveBeenCalled();
        });

        test('should not focus the element if state is and was focused', () => {
          component.state = { ...INITIAL_STATE, isFocused: true, isUnfocused: false };
          fixture.detectChanges();

          expect(focus).toHaveBeenCalledTimes(1);

          component.state = { ...INITIAL_STATE, isFocused: true, isUnfocused: false };
          fixture.detectChanges();

          expect(focus).toHaveBeenCalledTimes(1);
        });

        test(`should dispatch a ${FocusAction} when element becomes focused and state is not focused`, () => {
          nativeElement.focus();

          expect(next).toHaveBeenCalledWith(new FocusAction(INITIAL_STATE.id));
        });

        test('should not dispatch an action when element becomes focused and state is focused', () => {
          component.state = { ...INITIAL_STATE, isFocused: true, isUnfocused: false };
          fixture.detectChanges();

          nativeElement.focus();

          expect(next).not.toHaveBeenCalled();
        });

        test(`should dispatch an ${UnfocusAction} when element becomes unfocused and state is focused`, () => {
          component.state = { ...INITIAL_STATE, isFocused: true, isUnfocused: false };
          fixture.detectChanges();

          nativeElement.focus();
          nativeElement.blur();

          expect(next).toHaveBeenCalledWith(new UnfocusAction(INITIAL_STATE.id));
        });

        test('should not dispatch an action when element becomes unfocused and state is unfocused', () => {
          nativeElement.focus();
          nativeElement.blur();

          expect(next).not.toHaveBeenCalledWith(new UnfocusAction(INITIAL_STATE.id));
        });

        test('should add the cdk focus attribute if state is focused', () => {
          component.state = { ...INITIAL_STATE, isFocused: true, isUnfocused: false };
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
          component.state = { ...INITIAL_STATE, isFocused: true, isUnfocused: false };
          fixture.detectChanges();

          expect(focus).not.toHaveBeenCalled();
        });

        test('should not blur the element initially', () => {
          expect(blur).not.toHaveBeenCalled();
        });

        test('should not focus the element if state becomes focused', () => {
          component.state = { ...INITIAL_STATE, isFocused: true, isUnfocused: false };
          fixture.detectChanges();

          expect(focus).not.toHaveBeenCalled();
        });

        test('should not blur the element if state becomes unfocused', () => {
          component.state = { ...INITIAL_STATE, isFocused: true, isUnfocused: false };
          fixture.detectChanges();

          component.state = INITIAL_STATE;
          fixture.detectChanges();

          expect(blur).not.toHaveBeenCalled();
        });

        test(`should not dispatch an action when element becomes focused and state is not focused`, () => {
          nativeElement.focus();

          expect(next).not.toHaveBeenCalled();
        });

        test('should not dispatch an action when element becomes focused and state is focused', () => {
          component.state = { ...INITIAL_STATE, isFocused: true, isUnfocused: false };
          fixture.detectChanges();

          nativeElement.focus();

          expect(next).not.toHaveBeenCalled();
        });

        test(`should not dispatch an action when element becomes unfocused and state is focused`, () => {
          component.state = { ...INITIAL_STATE, isFocused: true, isUnfocused: false };
          fixture.detectChanges();

          nativeElement.focus();
          nativeElement.blur();

          expect(next).not.toHaveBeenCalled();
        });

        test('should not dispatch an action when element becomes unfocused and state is unfocused', () => {
          nativeElement.focus();
          nativeElement.blur();

          expect(next).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe('Without action subject', () => {
    beforeEach(() => {
      TestBed.overrideDirective(NgrxFormControlDirective, {
        set: {
          providers: [{ multi: true, provide: NGRX_FORM_VIEW_ADAPTER, useValue: viewAdapter }],
        },
      });
    });

    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [TestComponent],
      }).compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
    });

    test('should throw while trying to emit actions if no ActionsSubject was provided', () => {
      const newValue = 'new value';
      expect(() => onChange(newValue)).toThrowError();
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
          providers: [{ multi: true, provide: NG_VALUE_ACCESSOR, useValue: controlValueAccessor }],
        },
      });
    });

    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [TestComponent],
        providers: [provideMockStore()],
      }).compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(TestComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    test('should adapt a control value accessor to a form view adapter if no form view adapter is provided', () => {
      controlValueAccessor.setDisabledState = setDisabledState;

      component.state = { ...INITIAL_STATE, isDisabled: true, isEnabled: false };
      fixture.detectChanges();

      expect(registerOnChange).toHaveBeenCalled();
      expect(registerOnTouched).toHaveBeenCalled();
      expect(setDisabledState).toHaveBeenCalledWith(true);
      expect(writeValue).toHaveBeenCalledWith(INITIAL_STATE.value);
    });

    test('should adapt a control value accessor without disabling support', () => {
      const fn = () => {
        component.state = { ...INITIAL_STATE, isDisabled: true, isEnabled: false };
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
            { multi: true, provide: NG_VALUE_ACCESSOR, useValue: controlValueAccessor1 },
            { multi: true, provide: NG_VALUE_ACCESSOR, useValue: controlValueAccessor2 },
          ],
        },
      });
    });

    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [TestComponent],
        providers: [provideMockStore()],
      }).compileComponents();
    }));

    test('should throw if more than one control value accessor is provided', () => {
      const fn = () => {
        const fixture = TestBed.createComponent(TestComponent);
        fixture.detectChanges();
      };
      expect(fn).toThrowError();
    });
  });
});
