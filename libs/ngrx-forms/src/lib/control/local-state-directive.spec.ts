import { Component, ElementRef, viewChild } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Action, ActionsSubject } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { Mock, MockInstance } from 'vitest';
import { SetValueAction } from '../actions';
import { createFormControlState, FormControlState } from '../state';
import { FormViewAdapter, NGRX_FORM_VIEW_ADAPTER } from '../view-adapter/view-adapter';
import { NgrxLocalFormControlDirective } from './local-state-directive';
import { NgrxValueConverters } from './value-converter';

const FORM_CONTROL_ID = 'test ID';
const INITIAL_FORM_CONTROL_VALUE = 'value';
const INITIAL_STATE = createFormControlState<string>(FORM_CONTROL_ID, INITIAL_FORM_CONTROL_VALUE);

@Component({
  imports: [NgrxLocalFormControlDirective],
  template: `
    <input
      #el
      type="text"
      (ngrxFormsAction)="formsAction($event)"
      [ngrxEnableFocusTracking]="enableFocusTracking"
      [ngrxFormControlState]="state"
      [ngrxValueConverter]="valueConverter"
    />
  `,
})
export class TestComponent {
  public readonly element = viewChild<ElementRef<HTMLInputElement>>('el');

  public readonly formsAction = vi.fn();

  public enableFocusTracking = false;

  public state: FormControlState<string> = INITIAL_STATE;

  public valueConverter = NgrxValueConverters.default<any>();
}

describe(NgrxLocalFormControlDirective, () => {
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
  beforeEach(() => {
    setOnTouchedCallback = vi.fn();
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

  beforeEach(() => {
    TestBed.overrideDirective(NgrxLocalFormControlDirective, {
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

  describe('local action emit', () => {
    it(`should not dispatch a ${SetValueAction} to the global store if the view value changes`, () => {
      const newValue = 'new value';
      onChange(newValue);

      expect(next).not.toHaveBeenCalled();
    });

    it(`should dispatch a ${SetValueAction} to the output event emitter if the view value changes`, () => {
      const newValue = 'new value';
      onChange(newValue);

      expect(component.formsAction).toHaveBeenCalledWith(new SetValueAction(INITIAL_STATE.id, newValue));
    });

    it(`should not dispatch a ${SetValueAction} to the global store if the view value is the same as the state`, () => {
      onChange(INITIAL_STATE.value);

      expect(next).not.toHaveBeenCalled();
    });

    it(`should not dispatch a ${SetValueAction.name} to the output event emitter if the view value is the same as the state`, () => {
      onChange(INITIAL_STATE.value);

      expect(component.formsAction).not.toHaveBeenCalled();
    });
  });
});
