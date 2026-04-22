import { Component, ElementRef, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Mock } from 'vitest';
import { SetValueAction } from '../actions';
import { createFormControlState, FormControlState } from '../state';
import { FormViewAdapter, NGRX_FORM_VIEW_ADAPTER } from '../view-adapter/view-adapter';
import { NgrxLocalFormControlDirective } from './local-state-directive';

const FORM_CONTROL_ID = 'test ID';
const INITIAL_FORM_CONTROL_VALUE = 'value';
const INITIAL_STATE = createFormControlState<string>(FORM_CONTROL_ID, INITIAL_FORM_CONTROL_VALUE);

@Component({
  imports: [NgrxLocalFormControlDirective],
  template: ` <input #el type="text" (ngrxFormsAction)="formsAction($event)" [ngrxFormControlState]="state" /> `,
})
export class TestComponent {
  public readonly element = viewChild<ElementRef<HTMLInputElement>>('el');

  public readonly formsAction = vi.fn();

  public state: FormControlState<string> = INITIAL_STATE;
}

describe(NgrxLocalFormControlDirective, () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

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

  let viewAdapter: FormViewAdapter;
  beforeEach(() => {
    viewAdapter = {
      setIsDisabled: vi.fn(),
      setOnChangeCallback: setOnChangeCallback,
      setOnTouchedCallback: vi.fn(),
      setViewValue: vi.fn(),
    };
  });

  beforeEach(() => {
    TestBed.overrideDirective(NgrxLocalFormControlDirective, {
      add: {
        providers: [{ provide: NGRX_FORM_VIEW_ADAPTER, useValue: viewAdapter, multi: true }],
      },
    });
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent],
      providers: [],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('local action emit', () => {
    it(`should dispatch a ${SetValueAction.name} to the output event emitter if the view value changes`, () => {
      const newValue = 'new value';
      onChange(newValue);

      expect(component.formsAction).toHaveBeenCalledWith(new SetValueAction(INITIAL_STATE.id, newValue));
    });

    it(`should not dispatch a ${SetValueAction.name} to the output event emitter if the view value is the same as the state`, () => {
      onChange(INITIAL_STATE.value);

      expect(component.formsAction).not.toHaveBeenCalled();
    });
  });
});
